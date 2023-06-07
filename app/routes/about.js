import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AboutRoute extends Route {
  @action
  didTransition() {
    const applicationController = this.controllerFor('application');
    applicationController.set('sidebarIsClosed', true);
  }
}
