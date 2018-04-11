import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import normalizeCartoVectors from '../utils/normalize-carto-vectors';

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
}
