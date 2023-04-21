import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from 'city-map/config/environment';

export default class Router extends EmberRouter {
  @service metrics;

  location = config.locationType;
  rootURL = config.rootURL;

  didTransition(...args) {
    this._super(...args);
    this._trackPage();
  }

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.url;
      const title = this.getWithDefault('currentRouteName', 'unknown');
      this.metrics.trackPage({ page, title });
    });
  }
}

Router.map(function() { // eslint-disable-line
  this.route('about');
  this.route('city-map');
  this.route('data');
  this.route('feedback');
});
