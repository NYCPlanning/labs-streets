import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { task, timeout } from 'ember-concurrency';
import QueryParams from 'ember-parachute';
import carto from 'carto-promises-utility/utils/carto';
import mapboxgl from 'mapbox-gl';
import fetch from 'fetch';
import precisionRound from '../utils/precision-round';

export const LayerVisibilityParams = new QueryParams({
  'pierhead-bulkhead-lines': {
    defaultValue: true,
    refresh: true,
  },
  citymap: {
    defaultValue: true,
    refresh: true,
  },
  arterials: {
    defaultValue: false,
    refresh: true,
  },
  amendments: {
    defaultValue: true,
    refresh: true,
  },
  'street-centerlines': {
    defaultValue: true,
    refresh: true,
  },
  'name-changes': {
    defaultValue: false,
    refresh: true,
  },
  'zoning-districts': {
    defaultValue: false,
    refresh: true,
  },
  'commercial-overlays': {
    defaultValue: false,
    refresh: true,
  },
  'special-purpose-districts': {
    defaultValue: false,
    refresh: true,
  },
  'tax-lots': {
    defaultValue: false,
    refresh: true,
  },
  'floodplain-pfirm2015': {
    defaultValue: false,
    refresh: true,
  },
  'floodplain-efirm2007': {
    defaultValue: false,
    refresh: true,
  },
  aerials: {
    defaultValue: false,
    refresh: true,
  },
  'selected-aerial': {
    defaultValue: '',
    refresh: true,
  },
  lat: {
    defaultValue: -73.92,
  },

  lng: {
    defaultValue: 40.7,
  },

  zoom: {
    defaultValue: 10,
  },

  bearing: {
    defaultValue: 0,
  },

  pitch: {
    defaultValue: 0,
  },
});

const ParachuteController = Controller.extend(LayerVisibilityParams.Mixin);

export default class ApplicationController extends ParachuteController {
  @computed()
  get initMapOptions() {
    const mapOptions = this.getProperties('center', 'zoom', 'pitch', 'bearing');

    return {
      ...mapOptions,
      style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
      maxZoom: 19,
      minZoom: 9,
      maxBounds: [
        [-74.80302612305675, 40.23665579357652],
        [-73.03697387696565, 41.16014354995025],
      ],
    };
  }


  @computed('lat', 'lng')
  get center() {
    return [this.get('lat'), this.get('lng')];
  }

  shareURL = window.location.href;

  popupLocation = {
    lng: 0,
    lat: 0,
  };

  popupFeatures = [];

  searchTerms = '';

  highlightedStreetSource = null;
  highlightedAmendmentSource = null;

  searchedAddressSource = null;

  loadStateTask = task(function* () {
    yield timeout(500);
  }).restartable();

  @computed('lat', 'lng', 'zoom', 'pitch', 'bearing')
  get mapLatLngZoomHash() {
    const {
      lat, lng, zoom, pitch, bearing,
    } = this.getProperties('lat', 'lng', 'zoom', 'pitch', 'bearing');

    return `#${zoom}/${lng}/${lat}/${bearing}/${pitch}`;
  }

  mapPositionDebounce = task(function* (e) {
    yield timeout(500);
    const pitch = e.target.getPitch();
    const bearing = e.target.getBearing();
    let zoom = e.target.getZoom();
    let { lat: lng, lng: lat } = e.target.getCenter();

    lng = precisionRound(lng, 4);
    lat = precisionRound(lat, 4);
    zoom = precisionRound(zoom, 2);

    this.setProperties({
      zoom, lat, lng, pitch, bearing,
    });
  }).restartable();

  @action
  handleMapPositionChange(e) {
    this.get('mapPositionDebounce').perform(e);
  }

  @action
  handleMapLoad(map) {
    window.map = map; // for Maputnik Dev Server
    this.set('map', map);

    const navigationControl = new mapboxgl.NavigationControl();
    map.addControl(navigationControl, 'top-left');

    const geoLocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geoLocateControl, 'top-left');
    this.set('geoLocateControl', geoLocateControl);

    geoLocateControl.on('trackuserlocationstart', () => {
      if (this.get('searchedAddressSource')) {
        this.set('searchedAddressSource', null);
        this.set('searchTerms', '');
      }
    });

    const scaleControl = new mapboxgl.ScaleControl({ unit: 'imperial' });
    map.addControl(scaleControl, 'bottom-left');

    const basemapLayersToHide = [
      'highway_path',
      'highway_minor',
      'highway_major_casing',
      'highway_major_inner',
      'highway_major_subtle',
      'highway_motorway_casing',
      'highway_motorway_inner',
      'highway_motorway_subtle',
      'highway_motorway_bridge_casing',
      'highway_motorway_bridge_inner',
      'highway_name_other',
      'highway_name_motorway',
      'tunnel_motorway_casing',
      'tunnel_motorway_inner',
      'railway_transit',
      'railway_transit_dashline',
      'railway_service',
      'railway_service_dashline',
      'railway',
      'railway_dashline',
    ];

    basemapLayersToHide.forEach(layer => map.removeLayer(layer));
  }

  @action
  handleMapClick(e) {
    const { lng, lat } = e.lngLat;
    const SQL = `
    SELECT the_geom, 'alteration' AS type, altmappdf, effective, NULL AS bbl, NULL AS address
      FROM citymap_amendments_v0
      WHERE effective IS NOT NULL
        AND ST_Intersects(
          the_geom,
          ST_SetSRID(
            ST_MakePoint(
              ${lng},
              ${lat}
            ),4326
          )
        )
    UNION ALL
    SELECT the_geom, 'taxlot' AS type, NULL as altmappdf, NULL as effective, bbl, address
      FROM mappluto_v1711
        WHERE ST_Intersects(
          the_geom,
          ST_SetSRID(
            ST_MakePoint(
              ${lng},
              ${lat}
            ),4326
          )
        )
    `;

    this.set('popupLocation', e.lngLat);
    this.set('popupFeatures', null);

    carto.SQL(SQL, 'geojson')
      .then((FC) => {
        this.set('popupFeatures', FC.features);
      });
  }

  @action
  handleSearchSelect(result) {
    const map = this.get('map');

    // handle address search results
    if (result.type === 'lot') {
      const center = result.geometry.coordinates;
      this.set('searchedAddressSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: result.geometry,
        },
      });

      // turn off geolocation if it is on
      if (this.geoLocateControl._watchState !== 'OFF') {
        this.geoLocateControl._onClickGeolocate();
      }

      if (map) {
        map.flyTo({
          center,
          zoom: 15,
        });
      }
    }

    // handle street search results
    if (result.type === 'city-street') {
      const { bbox: { coordinates: [points] } } = result;
      const [min,, max] = points;

      map.fitBounds([min, max], { padding: 120 });

      this.set(
        'highlightedStreetSource',
        { type: 'geojson', data: result.the_geom },
      );
    }
  }

  @action
  handleSearchResultHover(result) {
    if (result.type === 'city-street') {
      this.set(
        'highlightedStreetSource',
        { type: 'geojson', data: result.the_geom },
      );
    }
  }

  @action
  handlePopupLinkOver(result) {
    this.set(
      'highlightedAmendmentSource',
      { type: 'geojson', data: result.feature },
    );
  }

  @action
  handleSearchClear() {
    this.set('highlightedStreetSource', null);
    this.set('searchedAddressSource', null);
  }

  @action
  handleMapLoading() {
    this.get('loadStateTask').perform();
  }

  @action
  handleSearchHoverOut() {
    this.set('highlightedStreetSource', null);
  }

  @action
  clearAmendmentHover() {
    this.set('highlightedAmendmentSource', null);
  }

  // runs on controller setup and calls
  // function to overwrite layer-groups'
  // visibility state with QP state
  setup({ queryParams }) {
    this.fetchData(queryParams, true);
  }

  queryParamsDidChange({ shouldRefresh, queryParams }) {
    if (shouldRefresh) {
      this.fetchData(queryParams);
    }

    this.set('shareURL', window.location.href);
  }

  // TODO: rewrite
  fetchData(queryParams, setDefaults = false) {
    this.get('model.layerGroups').forEach((layerGroup) => {
      const groupId = layerGroup.get('id');
      if (queryParams[groupId] !== undefined) {
        if (setDefaults) {
          this.setDefaultQueryParamValue(groupId, layerGroup.get('visible'));

          if (layerGroup.get('layerVisibilityType') === 'singleton') {
            this.setDefaultQueryParamValue('selected-aerial', layerGroup.get('selected'));
          }
        }

        layerGroup.set('visible', queryParams[groupId]);

        if (layerGroup.get('layerVisibilityType') === 'singleton' && queryParams['selected-aerial']) {
          layerGroup.set('selected', queryParams['selected-aerial']);
        }
      }
    });
  }

  @action
  handlePrint() {
    fetch('https://map-print.planninglabs.nyc', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        style: map.getStyle(), // eslint-disable-line
        center: map.getCenter(), // eslint-disable-line
        zoom: map.getZoom(), // eslint-disable-line
        bearing: map.getBearing(), // eslint-disable-line
        pitch: map.getPitch(), // eslint-disable-line
        title: 'NYC City Map',
        content: 'Disclaimer!  This map was printed from the One City Map Application produced by the NYC Department of City Planning',
      }),
    })
      .then(res => res.text())
      .then((text) => {
        const w = window.open();
        w.document.open();
        w.document.write(text);
        w.document.close();
      });
  }
}
