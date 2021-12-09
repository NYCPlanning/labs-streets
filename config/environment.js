'use strict';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'city-map',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
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

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production', 'ga-development'],
        config: {
          id: 'UA-84250233-12',
          // Use `analytics_debug.js` in development
          debug: environment === 'development',
          // Use verbose tracing of GA events
          trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development' && environment !== 'ga-development',
        },
      },
    ],
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
