'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember',
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:ember-best-practices/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'lines-around-directive': 0,
    'func-names': 0,
    'space-before-function-paren': 0,
    'prefer-arrow-callback': 0,
    'no-underscore-dangle': 0,
    camelcase: 0,
    'max-len': 0,
    'array-callback-return': 0,
    'react/prefer-stateless-function': 0,
    'class-methods-use-this': 0,
    'ember-best-practices/require-dependent-keys': 0,
    'react/sort-comp': 0,
    'ember/no-jquery': 'warn'
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2017,
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
        }, 
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      rules: {},
    },
  ],
};
