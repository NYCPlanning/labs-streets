import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import normalizeCartoVectors from '../utils/normalize-carto-vectors';

export default class ApplicationRoute extends Route {
  queryParams = {
    amendments: { refreshModel: true },
  }

  model = async function(params) {
    const mapboxGlConfigs = await hash({
      sources: this.store.findAll('source')
        .then(sources => normalizeCartoVectors(sources.toArray())),
      layers: this.store.peekAll('layer'),
      layerGroups: this.store.findAll('layer-group'),
    });

    mapboxGlConfigs.layerGroups.forEach((group) => {
      const groupId = group.get('id');
      if (params[groupId] !== undefined) {
        group.set('visible', JSON.parse(params[groupId]));
      }
    });

    return mapboxGlConfigs;
  }

  // afterModel({ layerGroups }, { queryParams }) {
  //   layerGroups.forEach((group) => {
  //     const groupId = group.get('id');
  //     if (queryParams[groupId] !== undefined) {
  //       group.set('visible', JSON.parse(queryParams[groupId]));
  //     }
  //   });
  // }
}
