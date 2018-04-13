import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import QueryParams from 'ember-parachute';
import carto from 'carto-promises-utility/utils/carto';
import mapboxgl from 'mapbox-gl';

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
    defaultValue: false,
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
  lat: {
    defaultValue: -73.92,
  },
  lng: {
    defaultValue: 40.7,
  },
  zoom: {
    defaultValue: 10,
  },
});

const ParachuteController = Controller.extend(LayerVisibilityParams.Mixin);

export default class ApplicationController extends ParachuteController {
  @computed('lat', 'lng', 'zoom')
  get initMapOptions() {
    const { lat, lng, zoom } = this.getProperties('lat', 'lng', 'zoom');

    return {
      style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
      zoom,
      center: [lat, lng],
      maxZoom: 19,
      minZoom: 9,
      maxBounds: [
        [-74.80302612305675, 40.23665579357652],
        [-73.03697387696565, 41.16014354995025],
      ],
    };
  }

  // TODO: Change once ZoLa preserves map pan/zoom state w/ query params
  @computed('lat', 'lng', 'zoom')
  get mapLatLngZoomHash() {
    const { lat, lng, zoom } = this.getProperties('lat', 'lng', 'zoom');
    return `#${zoom}/${lng}/${lat}`;
  }

  @argument
  popupLocation = {
    lng: 0,
    lat: 0,
  };

  @argument
  popupFeatures = [];

  @action
  handleLayerClick() {}
  // handleLayerClick(feature = { layer: {} }) {
  //   const { layer: { id: layerId } } = feature;
  //
  //   // there will be many of these
  //   if (layerId === 'citymap-amendments-fill') {
  //     const { properties: { altmappdf = '' } } = feature;
  //     const clean = altmappdf.split('/').pop();
  //     window.open(`https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${clean}`);
  //   }
  // }

  @action
  handleZoomend(e) {
    const zoom = e.target.getZoom();
    this.setProperties({ zoom });
  }

  @action
  handleDragend(e) {
    const { lat: lng, lng: lat } = e.target.getCenter();
    this.setProperties({ lat, lng });
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
    SELECT the_geom, altmappdf, effective
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

    // if (type === 'lot') {
    //   const { boro, block, lot } = bblDemux(result.bbl);
    //   this.set('searchTerms', result.label);
    //   this.transitionTo('lot', boro, block, lot);
    // }

    // if (type === 'zma') {
    //   this.set('searchTerms', result.label);
    //   this.transitionTo('zma', result.ulurpno);
    // }

    // if (type === 'zoning-district') {
    //   mainMap.set('shouldFitBounds', true);
    //   this.transitionTo('zoning-district', result.label);
    // }

    // if (type === 'neighborhood') {
    //   this.set('searchTerms', result.neighbourhood);
    //   const center = result.coordinates;
    //   mapInstance.flyTo({
    //     center,
    //     zoom: 13,
    //   });
    // }

    if (result.type === 'address') {
      const center = result.coordinates;

      if (map) {
        map.flyTo({
          center,
          zoom: 15,
        });
        map.once('moveend', () => { this.transitionTo('index'); });
      }
    }

    // if (type === 'special-purpose-district') {
    //   this.set('searchTerms', result.sdname);
    //   this.transitionTo('special-purpose-district', result.cartodb_id);
    // }

    // if (type === 'commercial-overlay') {
    //   this.set('searchTerms', result.label);
    //   this.transitionTo('commercial-overlay', result.overlay);
    // }
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
  }

  fetchData(queryParams, setDefaults = false) {
    this.get('model.layerGroups').forEach((group) => {
      const groupId = group.get('id');
      if (queryParams[groupId] !== undefined) {
        if (setDefaults) {
          this.setDefaultQueryParamValue(groupId, group.get('visible'));
        }
        group.set('visible', queryParams[groupId]);
      }
    });
  }
}
