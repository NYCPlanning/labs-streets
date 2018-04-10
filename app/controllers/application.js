import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { htmlSafe } from '@ember/string';
import mapboxgl from 'mapbox-gl';
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

  @argument
  popup = new mapboxgl.Popup({
    closeOnClick: false,
  });

  @argument
  popupFeatures = [];

  @computed('popupFeatures')
  get popupContent() {
    const features = this.get('popupFeatures');

    if (features.length === 0) return 'There are no City Map Amendments here.';

    const rows = features.map((feature) => {
      const { altmappdf, effective } = feature.properties;
      const cleanAltmappdf = altmappdf.split('/').pop();

      return `
        <li class="dark-gray">
          <strong><a href="https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${cleanAltmappdf}" target="_blank">
            <i aria-hidden="true" class="fa fa-external-link"></i>
            ${cleanAltmappdf}
          </a></strong> <small>Effective: ${effective}</small>
        </li>
      `;
    });

    const allRows = rows.join('');
    return `
      <div class="popup-content">
        <h4 class="popup-header">Map Amendments</h4>
        <ul class="no-bullet no-margin">${allRows}</ul>
      </div>
    `;
  }

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
    const map = e.target;
    const popup = this.get('popup');

    popup.setLngLat(e.lngLat)
      .setHTML('<i aria-hidden="true" class="fa fa-spinner fa-spin medium-gray fa-3x fa-fw"></i>')
      .addTo(map);

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
        popup.setHTML(this.get('popupContent'));
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
