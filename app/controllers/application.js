import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { task, timeout } from 'ember-concurrency';
import QueryParams from 'ember-parachute';
import carto from 'carto-promises-utility/utils/carto';
import mapboxgl from 'mapbox-gl';
import fetch from 'fetch';
import { alias } from '@ember/object/computed';
import precisionRound from '../utils/precision-round';

// get a geojson rectangle for the current map's view
const getBoundsGeoJSON = (map) => {
  const canvas = map.getCanvas();
  const { width, height } = canvas;
  const cUL = map.unproject([0, 0]).toArray();
  const cUR = map.unproject([width, 0]).toArray();
  const cLR = map.unproject([width, height]).toArray();
  const cLL = map.unproject([0, height]).toArray();

  return {
    type: 'Polygon',
    coordinates: [[cUL, cUR, cLR, cLL, cUL]],
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:4326',
      },
    },
  };
};

export const LayerVisibilityParams = new QueryParams({
  layerGroups: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value) {
      return value.split(',');
    },
  },
  'selected-aerial': {
    defaultValue: 'aerials-2016',
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

  popupFeatures = null;

  searchTerms = '';

  highlightedStreetSource = null;
  highlightedAmendmentSource = null;

  searchedAddressSource = null;

  boundsGeoJSON = null;

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

    this.set('boundsGeoJSON', getBoundsGeoJSON(this.map));
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

    this.set('boundsGeoJSON', getBoundsGeoJSON(this.map));
  }

  @action
  handleMapClick(e) {
    // Open the popup and clear its content (defaults to showing spinner)
    this.set('popupFeatures', null);
    this.set('popupLocation', e.lngLat);

    // Query and set the popup content
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

  @action
  handlePrint() {
    const config = {
      mapConfig: {
        style: map.getStyle(), // eslint-disable-line
        center: map.getCenter(), // eslint-disable-line
        zoom: map.getZoom(), // eslint-disable-line
        bearing: map.getBearing(), // eslint-disable-line
        pitch: map.getPitch(), // eslint-disable-line
      },
      logo: 'https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png',
      title: 'NYC Street Map',
      content: 'This map was printed from NYC Street Map Application created by the NYC Department of City Planning. It is not an official record and all information displayed must be confirmed based on official records.',
      source: 'NYC Street Map | https://streetmap.planning.nyc.gov',
    };

    fetch('https://map-print.planninglabs.nyc/config', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })
      .then(res => res.json())
      .then((res) => {
        if (res.status === 'success') {
          window.open('https://map-print.planninglabs.nyc', '_blank');
        }
      });
  }

  // runs on controller setup and calls
  // function to overwrite layer-groups'
  // visibility state with QP state
  setup({ queryParams: { layerGroups: layerGroupParams, 'selected-aerial': selectedAerial } }) {
    const layerGroupModels = this.get('model.layerGroups');

    if (layerGroupParams.length) {
      layerGroupModels.forEach((layerGroup) => {
        if (layerGroupParams.includes(layerGroup.get('id'))) {
          layerGroup.set('visible', true);
        } else {
          layerGroup.set('visible', false);
        }
      });
    }

    if (selectedAerial) {
      this.get('model.layerGroupMap.aerials').set('selected', selectedAerial);
    }

    // alias (two-way bind) model props to controller
    this.set('layerGroups', alias('visibleLayerGroups'));
    this.set('selected-aerial', alias('model.layerGroupMap.aerials.selected'));
  }

  queryParamsDidChange() {
    this.set('shareURL', window.location.href);
  }

  @computed('model.layerGroups.@each.visible')
  get visibleLayerGroups() {
    return this.get('model.layerGroups').filterBy('visible', true).mapBy('id');
  }
  set visibleLayerGroups(value) { /* noop */ }

  @action
  flyTo(center, zoom) {
    // Fly to the lot
    this.get('map').flyTo({ center, zoom });

    // Turn on the Tax Lots layer group
    this.set('tax-lots', true);
  }
}
