'use strict';

const HOST = process.env.API_HOST || 'https://layers-api.planninglabs.nyc';
const CARTO_USER = process.env.CARTO_USER || 'planninglabs';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'city-map',
    environment,
    rootURL: '/',
    host: HOST,
    'carto-username': CARTO_USER,
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

    'ember-mapbox-composer': {
      host: HOST,
      namespace: 'v1',
    },

    'mapbox-gl': {
      accessToken: '',
      map: {
        style: `${HOST}/style.json`,
      },
    },

    'labs-search': {
      host: (environment === 'devlocal') ? '//localhost:4000' : 'https://search-api-production.herokuapp.com',
      route: 'search',
      helpers: ['geosearch-v2'],
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
      {
        name: 'GoogleAnalyticsFour',
        environments: ['development', 'production'],
        config: {
          id: 'G-MZLX2P6SNE',
          options: {
            debug_mode: environment === 'development',
          },
        },
      },
    ],
  };

  if (environment === 'development') {
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
  }


  if (environment === 'devlocal') {
    ENV.host = 'http://localhost:3000';
    ENV['mapbox-gl'].map.style = 'http://localhost:3000/v1/base/style.json';
    ENV['ember-mapbox-composer'].host = 'http://localhost:3000';
  }

  return ENV;
};
