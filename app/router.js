import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { get } from '@ember/object';
import config from './config/environment';

const Router = EmberRouter.extend({
  metrics: service(),

  didTransition(...args) {
    this._super(...args);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');
      get(this, 'metrics').trackPage({ page, title });
    });
  },

  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('about');
  this.route('city-map');
  this.route('data');
  this.route('feedback');
});

export default Router;
