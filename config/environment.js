'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'city-map',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    namespace: 'v1',

    'mapbox-gl': {
      accessToken: 'peanut-butter',
      map: {
        style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
      },
    },

    'labs-search': {
      host: (environment === 'devlocal') ? '//localhost:4000' : 'https://search-api-production.herokuapp.com',
      route: 'search',
    },

    fontawesome: {
      icons: {
        'free-regular-svg-icons': 'all',
        'free-solid-svg-icons': 'all',
      },
    },

  };

  if (environment === 'development') {
    ENV.namespace = 'v1';

    // Enable this line to specify the address for a locally run Layers API
    // ENV.host = 'http://localhost:3000';

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV.namespace = 'v1';
  }

  if (environment === 'staging') {
    // here you can enable a staging-specific feature
    ENV.host = 'https://layers-api-staging.planninglabs.nyc';
    ENV.namespace = 'v1';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.host = 'https://layers-api.planninglabs.nyc';
    ENV.namespace = 'v1';
  }

  return ENV;
};
