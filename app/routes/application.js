import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import normalizeCartoVectors from 'carto-promises-utility/utils/normalize-carto-vectors';
import { action } from '@ember-decorators/object';
import { next } from '@ember/runloop';

export default class ApplicationRoute extends Route {
  model = async function() {
    const sources = await this.store.findAll('source')
      .then(sourceModels => normalizeCartoVectors(sourceModels.toArray()));
    const layers =
      await this.store.peekAll('layer');
    const layerGroups =
      await this.store.findAll('layer-group');
    const amendmentsFill =
      await this.store.peekRecord('layer', 'citymap-amendments-fill');

    return hash({
      sources,
      layers,
      layerGroups,
      amendmentsFill,
    });
  }

  @action
  didTransition() {
    next(function() {
      window.dispatchEvent(new Event('resize'));
    });
  }
}
