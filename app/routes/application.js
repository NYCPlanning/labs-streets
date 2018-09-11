import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { action } from '@ember-decorators/object';
import { next } from '@ember/runloop';

export default class ApplicationRoute extends Route {
  beforeModel = (transition) => {
    // only transition to about if index is loaded and there is no hash
    if (transition.intent.url === '/' && window.location.href.split('#').length < 2) {
      this.transitionTo('about');
    }
  }

  model = async function() {
    const ids = ['citymap',
      'street-centerlines',
      'pierhead-bulkhead-lines',
      'amendments',
      'amendments-pending',
      'arterials',
      'name-changes',
      'paper-streets',
      'stair-streets',
      'zoning-districts',
      'commercial-overlays',
      'special-purpose-districts',
      'tax-lots',
      'floodplain-pfirm2015',
      'floodplain-efirm2007',
      'aerials'];

    const layers =
      await this.store.peekAll('layer');
    const layerGroups =
      await this.store.query('layer-group', { ids });
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

  @action
  didTransition() {
    next(function() {
      // not supported in IE 11
      window.dispatchEvent(new Event('resize'));
    });
  }
}
