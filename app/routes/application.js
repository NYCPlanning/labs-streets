import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';
import { next } from '@ember/runloop';

export default class ApplicationRoute extends Route {
  beforeModel = (transition) => {
    // only transition to about if index is loaded and there is no hash
    if (transition.intent.url === '/' && window.location.href.split('#').length < 2) {
      this.transitionTo('about');
    }
  }

  model = async () => {
    const layerGroups = await this.store.query('layer-group', {
      'layer-groups': [
        { id: 'citymap', visible: true }, //layers: [{}, {}, {}, {}, {}, {}, {}, { tooltipTemplate: '{{{street}}}' }] },
        { id: 'street-centerlines', visible: true },
        { id: 'pierhead-bulkhead-lines', visible: true },
        { id: 'amendments', visible: true },
        { id: 'amendments-pending', visible: false },
        { id: 'arterials', visible: false },
        { id: 'name-changes', visible: false },
        { id: 'paper-streets', visible: false },
        { id: 'stair-streets', visible: false },
        { id: 'zoning-districts', visible: false },
        { id: 'special-purpose-districts', visible: false },
        { id: 'tax-lots', visible: false, layers: [{ tooltipable: true, tooltipTemplate: '{{address}}' }] },
        { id: 'commercial-overlays', visible: false },
        { id: 'floodplain-efirm2007', visible: false },
        { id: 'floodplain-pfirm2015', visible: false },
        { id: 'aerials', visible: false },
      ],
    });

    const layers =
      await this.store.peekAll('layer');

    const amendmentsFill =
      await this.store.peekRecord('layer', 'citymap-amendments-fill');

    const { mapboxStyle: initialStyle } = layerGroups.get('meta');


    return {
      layers,
      layerGroups,
      amendmentsFill,
      initialStyle,
    };
  }

  @action
  didTransition() {
    next(function() {
      // not supported in IE 11
      window.dispatchEvent(new Event('resize'));
    });
  }
}
