import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import QueryParams from 'ember-parachute';
import carto from '@nycplanning/ember/utils/carto';
import mapboxgl from 'mapbox-gl';
import fetch from 'fetch';
import turfBbox from '@turf/bbox';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import precisionRound from '../utils/precision-round';
import trackEvent from '../utils/track-event';


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
  'selected-aerial': {
    defaultValue: 'aerials-2016',
    refresh: true,
  },
  lat: {
    defaultValue: 40.7,
  },

  lng: {
    defaultValue: -73.92,
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

  'layerGroupService.visibleLayerGroups': {
    defaultValue: [],
    refresh: true,
    as: 'layer-groups',
  },
});

const ParachuteController = Controller.extend(LayerVisibilityParams.Mixin);

export default class ApplicationController extends ParachuteController {
  @service metrics

  @service('layerGroups') layerGroupService

  @alias('layerGroupService.visibleLayerGroups')
  layerGroups;

  @computed()
  get initMapOptions() {
    const mapOptions = this.getProperties('center', 'zoom', 'pitch', 'bearing');

    return {
      ...mapOptions,
      style: this.get('model.initialStyle'),
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
    return [this.get('lng'), this.get('lat')];
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

  @(task(function* () {
    yield timeout(500);

    const map = this.get('mapInstance');

    if (map) {
      map.setCenter([this.get('lng'), this.get('lat')]);
    }
  }).restartable())
  loadStateTask;

  @computed('lat', 'lng', 'zoom', 'pitch', 'bearing')
  get mapLatLngZoomHash() {
    const {
      lat, lng, zoom, pitch, bearing,
    } = this.getProperties('lat', 'lng', 'zoom', 'pitch', 'bearing');

    return `#${zoom}/${lng}/${lat}/${bearing}/${pitch}`;
  }

  @(task(function* (e) {
    yield timeout(500);
    const pitch = e.target.getPitch();
    const bearing = e.target.getBearing();
    let zoom = e.target.getZoom();
    let { lat, lng } = e.target.getCenter();

    lng = precisionRound(lng, 4);
    lat = precisionRound(lat, 4);
    zoom = precisionRound(zoom, 2);

    this.setProperties({
      zoom, lat, lng, pitch, bearing,
    });

    this.set('boundsGeoJSON', getBoundsGeoJSON(this.mapInstance));
  }).restartable())
  mapPositionDebounce;

  @action
  handleMapPositionChange(e) {
    this.get('mapPositionDebounce').perform(e);
  }

  @action
  handleMapLoad(map) {
    window.map = map; // for Maputnik Dev Server
    this.set('mapInstance', map);

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

    this.set('boundsGeoJSON', getBoundsGeoJSON(this.mapInstance));
  }

  @action
  @trackEvent('click', 'popup', 'popupLocation')
  handleMapClick(e) {
    const citymapLayerDisabled = this.get('model').layerGroups.toArray().filter(layerGroup => layerGroup.get('visible')).find(layer => layer.id === 'citymap') === undefined;

    const pendingAmendmentsLayerDisabled = this.get('model').layerGroups.toArray().filter(layerGroup => layerGroup.get('visible')).find(layer => layer.id === 'amendments-pending') === undefined;

    const amendmentsLayerDisabled = this.get('model').layerGroups.toArray().filter(layerGroup => layerGroup.get('visible')).find(layer => layer.id === 'amendments') === undefined;

    const streetSectionLayerDisabled = this.get('model').layerGroups.toArray().filter(layerGroup => layerGroup.get('visible')).find(layer => layer.id === 'street-sections') === undefined;

    // Open the popup and clear its content (defaults to showing spinner)
    this.set('popupFeatures', null);
    this.set('popupLocation', e.lngLat);

    // Query and set the popup content
    const { lng, lat } = e.lngLat;
    const SQL = `
    SELECT the_geom, 'alteration' AS type, altmappdf, status, effect_dt as effective, NULL as bbl, NULL as address, NULL::timestamp as last_date, NULL as do_path
      FROM dcp_dcm_city_map_alterations
      WHERE (effect_dt IS NOT NULL
              OR status = '13')
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
    SELECT the_geom, 'taxlot' AS type, NULL as altmappdf, NULL as status, NULL as effective, bbl, address, NULL::timestamp as last_date, NULL as do_path
      FROM dcp_mappluto
        WHERE ST_Intersects(
          the_geom,
          ST_SetSRID(
            ST_MakePoint(
              ${lng},
              ${lat}
            ),4326
          )
        )
    UNION ALL
    SELECT the_geom, 'streetsect' AS type, NULL as altmappdf, NULL as status, NULL as effective, NULL as bbl, NULL as address, last_date, do_path 
      FROM dcp_final_section_map_index
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
        // sigh... queryRenderedFeatures() for street name changes and append the results to the Features returned from Carto
        const map = this.get('mapInstance');
        const layers = ['citymap-name-changes-circle', 'citymap-name-changes-line', 'citymap-name-changes-fill'];
        const streetNameChanges = map.queryRenderedFeatures(
          e.point,
          { layers },
        );

        // append a type property for use in rendering the popup
        streetNameChanges.forEach((feature) => {
          feature.properties.type = 'streetnamechange'; // eslint-disable-line
          return feature;
        });

        let filteredFeatures = FC.features;

        if (citymapLayerDisabled) filteredFeatures = filteredFeatures.filter(feature => feature.properties.type !== 'taxlot');
        if (amendmentsLayerDisabled) filteredFeatures = filteredFeatures.filter(feature => (feature.properties.type === 'alteration' && feature.properties.effective === null) || feature.properties.type === 'taxlot' || feature.properties.type === 'streetsect');
        if (pendingAmendmentsLayerDisabled) filteredFeatures = filteredFeatures.filter(feature => (feature.properties.type === 'alteration' && feature.properties.effective !== null) || feature.properties.type === 'taxlot' || feature.properties.type === 'streetsect');
        if (streetSectionLayerDisabled) filteredFeatures = filteredFeatures.filter(feature => (feature.properties.type !== 'streetsect'));

        this.set('popupFeatures', [...filteredFeatures, ...streetNameChanges]);
      });
  }

  @action
  handleSearchSelect(result) {
    const map = this.get('mapInstance');

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

    // handle alteration search results
    if (result.type === 'city-map-alteration') {
      const bounds = turfBbox.default(result.the_geom);
      map.fitBounds(bounds, { padding: 120 });

      this.set(
        'highlightedAmendmentSource',
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

    if (result.type === 'city-map-alteration') {
      this.set(
        'highlightedAmendmentSource',
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
  handleLayerMouseMove() {
    const map = this.get('mapInstance');
    map.getCanvas().style.cursor = 'pointer';
  }

  @action
  handleMapMouseDrag() {
    const map = this.get('mapInstance');
    map.getCanvas().style.cssText += 'cursor:-webkit-grabbing; cursor:-moz-grabbing; cursor:grabbing;';
  }

  @action
  clearAmendmentHover() {
    this.set('highlightedAmendmentSource', null);
  }

  queryParamsDidChange() {
    this.set('shareURL', window.location.href);
  }

  @action
  handlePrint() {
    // get layerGroups that are currently visible and have legendConfigs
    // then map to get legendConfig objects
    const visibleLegendConfigs = this.get('model').layerGroups.toArray()
      .filter((layerGroup) => { // eslint-disable-line
        return layerGroup.get('visible') && layerGroup.get('legendConfig');
      })
      .map((layerGroup) => {
        const config = layerGroup.get('legendConfig');
        config.id = layerGroup.id;
        return config;
      });

    const printConfig = {
      mapConfig: {
        style: map.getStyle(), // eslint-disable-line
        center: map.getCenter(), // eslint-disable-line
        zoom: map.getZoom(), // eslint-disable-line
        bearing: map.getBearing(), // eslint-disable-line
        pitch: map.getPitch(), // eslint-disable-line
      },
      logo: 'https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png',
      title: 'Street Map',
      content: 'This map was printed from NYC Street Map Application created by the NYC Department of City Planning. It is not an official record and all information displayed must be confirmed based on official records.',
      contentEditable: false,
      source: 'NYC Street Map | https://streetmap.planning.nyc.gov',
      sourceEditable: false,
    };

    if (visibleLegendConfigs.length > 0) printConfig.legendConfig = visibleLegendConfigs;

    const printServiceURL = 'https://map-print.planninglabs.nyc';

    fetch(`${printServiceURL}/config`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(printConfig),
    })
      .then(res => res.json())
      .then((res) => {
        if (res.status === 'success') {
          window.open(printServiceURL, '_blank');
        }
      });
  }

  // this action extracts query-param-friendly state of layer groups
  // for various paramable layers
  @action
  handleLayerGroupChange() {
    // handle visibility state
    const visibleLayerGroups = this.model.layerGroups
      .filter(({ visible }) => visible)
      .map(({ id }) => id)
      .sort();

    this.set('layerGroups', visibleLayerGroups);
  }

  @action
  setModelsToDefault() {
    this.model.layerGroups.forEach(model => model.rollbackAttributes());
    this.handleLayerGroupChange();
  }

  @action
  flyTo(center, zoom) {
    // Fly to the lot
    this.get('mapInstance').flyTo({ center, zoom });

    // Turn on the Tax Lots layer group
    this.set('tax-lots', true);
  }
}
