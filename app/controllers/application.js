import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';
import { htmlSafe } from '@ember/string';
import QueryParams from 'ember-parachute';
import carto from 'carto-promises-utility/utils/carto';


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
    defaultValue: -74.1197,
  },
  lng: {
    defaultValue: 40.6976,
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
    };
  }

  @computed('popupTop', 'popupLeft', 'popupOffset')
  get style() {
    const position = this.getProperties('popupTop', 'popupLeft', 'popupOffset');
    return htmlSafe(`
      top: ${position.popupTop + position.popupOffset}px;
      left: ${position.popupLeft + position.popupOffset}px;
      pointer-events: none;
    `);
  }

  @argument
  popupFeatures = [];

  @argument
  popupOffset = 20;

  @required
  @argument
  @type('number')
  popupTop = 0;

  @required
  @argument
  @type('number')
  popupLeft = 0;

  @action
  handleLayerClick(feature = { layer: {} }) {
    // const { layer: { id: layerId } } = feature;
    //
    // // there will be many of these
    // if (layerId === 'citymap-amendments-fill') {
    //   const { properties: { altmappdf = '' } } = feature;
    //   const clean = altmappdf.split('/').pop();
    //   window.open(`https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${clean}`);
    // }
  }

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
    window.map = map;

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
    // set position of popup
    const { x, y } = e.point;

    this.set('popupTop', y);
    this.set('popupLeft', x);

    // get citymap amendments that intersect with this lngLat
    const { lng, lat } = e.lngLat;

    const SQL = `
    SELECT the_geom, altmappdf, effective
      FROM citymap_amendments_v0
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
