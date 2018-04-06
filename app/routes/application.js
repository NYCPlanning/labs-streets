import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import normalizeCartoVectors from '../utils/normalize-carto-vectors';

export default class ApplicationRoute extends Route {
  model() {
    return hash({
      sources: this.store.findAll('source')
        .then(sources => normalizeCartoVectors(sources.toArray())),
      layerGroups: this.store.findAll('layer-group'),
    });
  }
}
