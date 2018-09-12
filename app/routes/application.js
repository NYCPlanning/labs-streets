import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { action } from '@ember-decorators/object'; // eslint-disable-line
import { next } from '@ember/runloop';

export default class ApplicationRoute extends Route {
  beforeModel = (transition) => {
    // only transition to about if index is loaded and there is no hash
    if (transition.intent.url === '/' && window.location.href.split('#').length < 2) {
      this.transitionTo('about');
    }
  }

  model = async function() {
    const layers =
      await this.store.peekAll('layer');
    const layerGroups =
      await this.store.query('layer-group', {
        'layer-groups': [
          { id: 'citymap', visible: true },
          { id: 'street-centerlines', visible: true },
          { id: 'pierhead-bulkhead-lines', visible: true },
          { id: 'amendments', visible: true },
          { id: 'amendments-pending', visible: false },
          { id: 'arterials', visible: false },
          { id: 'name-changes', visible: false },
          { id: 'paper-streets', visible: false },
          { id: 'stair-streets', visible: false },
          { id: 'zoning-districts', visible: false },
          { id: 'commercial-overlays', visible: false },
          { id: 'special-purpose-districts', visible: false },
          { id: 'tax-lots', visible: false },
          { id: 'floodplain-pfirm2015', visible: false },
          { id: 'floodplain-efirm2007', visible: false },
          { id: 'aerials', visible: false },
        ],
      });

    const amendmentsFill =
      await this.store.peekRecord('layer', 'citymap-amendments-fill');

    const defaultVisibleLayerGroups = layerGroups.filterBy('visible').mapBy('id').sort().copy();

    const { mapboxStyle: initialStyle } = layerGroups.get('meta');

    return hash({
      layers,
      layerGroups,
      amendmentsFill,
      defaultVisibleLayerGroups,
      initialStyle,
    });
  }

  afterModel(model, transition) {
    const { layerGroups, defaultVisibleLayerGroups } = model;
    const {
      queryParams: {
        'layer-groups': layerGroupParams = '[]',
      },
    } = transition;

    const params = JSON.parse(layerGroupParams).sort();

    // if not every default visible layer group is included in the params
    const isDefaultState = defaultVisibleLayerGroups
      .every(layerGroup => params.any(param => (param.id || param) === layerGroup));

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
  }

  setupController(controller, model) {
    const { defaultVisibleLayerGroups } = model;

    controller.setDefaultQueryParamValue('layerGroups', defaultVisibleLayerGroups);
    super.setupController(controller, model);
  }

  @action
  didTransition() {
    next(function() {
      // not supported in IE 11
      window.dispatchEvent(new Event('resize'));
    });
  }
}
