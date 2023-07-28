import Route from '@ember/routing/route';

export default class DataRoute extends Route {
  async model() {
    const sources = this.store.peekAll('source');
    return sources.toArray().uniqBy('meta.description');
  }
}
