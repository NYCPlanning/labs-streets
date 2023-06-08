import EmberRouter from '@ember/routing/router';
import { next, scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from 'city-map/config/environment';

export default class Router extends EmberRouter {
  @service metrics;

  location = config.locationType;

  rootURL = config.rootURL;

  didTransition(...args) {
    this._super(...args);
    this._trackPage();

    next(function() {
      // window.dispatchEvent(new Event('resize'));
      // ^ not supported in IE 11, so we do this:
      const resizeEvent = window.document.createEvent('UIEvents');
      resizeEvent.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(resizeEvent);
    });
  }

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.url;
      const title = this.getWithDefault('currentRouteName', 'unknown');
      this.metrics.trackPage({ page, title });
    });
  }
}

Router.map(function() { // eslint-disable-line array-callback-return
  this.route('about');
  this.route('city-map');
  this.route('data');
  this.route('feedback');
});
