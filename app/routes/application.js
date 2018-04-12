import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import normalizeCartoVectors from 'carto-promises-utility/utils/normalize-carto-vectors';

export default class ApplicationRoute extends Route {
  model = async function() {
    const mapboxGlConfigs = await hash({
      sources: this.store.findAll('source')
        .then(sources => normalizeCartoVectors(sources.toArray())),
      layers: this.store.peekAll('layer'),
      layerGroups: this.store.findAll('layer-group'),
    });

    return mapboxGlConfigs;
  }
}
