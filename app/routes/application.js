import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service('layerGroups')
  layerGroupService;

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

    const { mapboxStyle: initialStyle } = layerGroups.get('meta');

    return hash({
      layers,
      layerGroups,
      amendmentsFill,
      initialStyle,
    });
  }

  /**
   * @override: ember lifecycle
   */
  setupController(controller, model) {
    const { layerGroups } = model;
    console.log("layer groups is : ", layerGroups)
    this.get('layerGroupService').initializeObservers(layerGroups, controller);

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
