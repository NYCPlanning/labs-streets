import Service from '@ember/service';
import { A } from '@ember/array';
import { copy } from 'ember-copy';

export default class LayerGroupService extends Service {
  init(...args) {
    super.init(args);
    this.layerGroupRegistry = A([]);
    this.visibleLayerGroups = A([]);
  }

  /*
    initializeObservers
    public
    must occur _after_ the fully resolved _route_ model is set to the controller
    sets up initial state and observers for the controller

    signature is a model directly from the route
  */
  initializeObservers(layerGroups, controller) {
    // set initial state from QPs, grab init state from models
    const defaultVisibleLayerGroups = copy(layerGroups.filterBy('visible').mapBy('id').sort());
    const params = this.get('visibleLayerGroups');

    // set defaults through ember parachute
    controller.setDefaultQueryParamValue('layerGroupService.visibleLayerGroups', defaultVisibleLayerGroups);

    // check if the provided params are the default
    const isDefaultState = defaultVisibleLayerGroups
      .every(layerGroup => params.any(param => (param.id || param) === layerGroup));

    // check if QP isn't default and there are other params
    if (!isDefaultState && params.length) {
      // set initial state from query params when not default
      layerGroups.forEach((layerGroup) => {
        layerGroup.set('visible', params.any(param => (param.id || param) === layerGroup.id));

        if (layerGroup.get('layerVisibilityType') === 'singleton') {
          const { selected } = params.find(param => (param.id || param) === layerGroup.id) || {};

          if (selected) layerGroup.set('selected', selected);
        }
      });
    }

    this.addObserver('layerGroupRegistry.@each.selected', this, '_modelsToParams');
    this.addObserver('layerGroupRegistry.@each.visible', this, '_modelsToParams');
    this.addObserver('visibleLayerGroups.length', this, '_paramsToModels');
  }

  // translate model state to a param state object
  _modelsToParams() {
    const layerGroups = this.get('layerGroupRegistry');

    // calculate new param state object
    const newParams = layerGroups
      .filterBy('visible')
      .map((layerGroup) => {
        if (layerGroup.get('layerVisibilityType') === 'singleton') {
          return { id: layerGroup.get('id'), selected: layerGroup.get('selected.id') };
        }

        return layerGroup.get('id');
      }).sort();

    // set the new param state object
    this.set('visibleLayerGroups', newParams);
  }

  // translate param state object to model state
  _paramsToModels() {
    const layerGroups = this.get('layerGroupRegistry');
    const params = this.get('visibleLayerGroups');

    if (Array.isArray(params) && layerGroups && params.length) {
      layerGroups.forEach((layerGroup) => {
        const foundParam = params.find(param => (param.id || param) === layerGroup.id);
        if (foundParam) {
          layerGroup.set('visible', true);

          if (foundParam.selected) {
            layerGroup.set('selected', foundParam.selected);
          }
        } else {
          layerGroup.set('visible', false);
        }
      });
    }
  }
}
