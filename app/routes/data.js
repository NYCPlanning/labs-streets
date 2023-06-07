import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class DataRoute extends Route {
  async model() {
    const sources = this.store.peekAll('source');
    return sources.toArray().uniqBy('meta.description');
  }

  @action
  didTransition() {
    const applicationController = this.controllerFor('application');
    applicationController.set('sidebarIsClosed', true);
  }
}
