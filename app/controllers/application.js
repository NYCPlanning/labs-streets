import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import QueryParams from 'ember-parachute';

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
});

const ParachuteController = Controller.extend(LayerVisibilityParams.Mixin);

export default class ApplicationController extends ParachuteController {
  initMapOptions = {
    style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
    zoom: 10,
    center: [-74.1197, 40.6976],
  }

  @action
  handleLayerClick(feature = { layer: {} }) {
    const { layer: { id: layerId } } = feature;

    // there will be many of these
    if (layerId === 'citymap-amendments-fill') {
      const { properties: { altmappdf = '' } } = feature;
      const clean = altmappdf.split('/').pop();
      window.open(`https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${clean}`);
    }
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
      // 'highway_name_other',
      // 'highway_name_motorway',
    ];

    basemapLayersToHide.forEach(layer => map.removeLayer(layer));
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
          console.log(groupId, group.get('visible'));
        }
        group.set('visible', queryParams[groupId]);
      }
    });
  }
}
