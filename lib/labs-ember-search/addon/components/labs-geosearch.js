import Component from '@ember/component';
import fetch from 'fetch';
import { computed } from '@ember-decorators/object'; // eslint-disable-line
import { classNames } from 'ember-decorators/component';
import { action } from 'ember-decorators/object';
import { task, timeout } from 'ember-concurrency';
import { argument } from '@ember-decorators/argument';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import { getOwner } from '@ember/application';
import layout from '../templates/components/labs-geosearch';

const DEBOUNCE_MS = 100;

@classNames('labs-geosearch')
export default class LabsGeosearchComponent extends Component {
  constructor() {
    super();
    const { host = '//zola-api.planninglabs.nyc', route = 'search' } =
      getOwner(this).resolveRegistration('config:environment')['labs-search'];

    this.set('host', host);
    this.set('route', route);
  }

  @argument
  @type(Action)
  onSelect = () => {};

  @computed('searchTerms')
  get results() {
    const searchTerms = this.get('searchTerms');
    return this.get('debouncedResults').perform(searchTerms);
  }

  @computed('results.value')
  get resultsCount() {
    const results = this.get('results.value');
    if (results) return results.length;
    return 0;
  }

  @computed('searchTerms')
  get endpoint() {
    const searchTerms = this.get('searchTerms');
    const host = this.get('host');
    const route = this.get('route');

    return `${host}/${route}?q=${searchTerms}`;
  }

  @argument
  host = 'https://zola-search-api.planninglabs.nyc';

  @argument
  route = 'search';

  layout = layout
  searchTerms = '';
  selected = 0;
  focused = false;
  currResults = [];
  loading = null;

  debouncedResults = task(function* (searchTerms) {
    if (searchTerms.length < 3) this.cancel();
    yield timeout(DEBOUNCE_MS);
    const URL = this.get('endpoint');

    this.set('loading', new Promise(function(resolve) {
      setTimeout(resolve, 500);
    }));

    const raw = yield fetch(URL);
    const resultList = yield raw.json();

    this.set('currResults', resultList);
    this.set('loading', null);

    return resultList;
  }).keepLatest()

  keyPress(event) {
    const selected = this.get('selected');
    const { keyCode } = event;

    // enter
    if (keyCode === 13) {
      const results = this.get('results.value');
      if (results && results.get('length')) {
        const selectedResult = results.objectAt(selected);
        this.send('goTo', selectedResult);
      }
    }
  }

  keyUp(event) {
    const selected = this.get('selected');
    const resultsCount = this.get('resultsCount');
    const { keyCode } = event;

    const incSelected = () => { this.set('selected', selected + 1); };
    const decSelected = () => { this.set('selected', selected - 1); };

    if ([38, 40, 27].includes(keyCode)) {
      const results = this.get('results.value');

      // up
      if (keyCode === 38) {
        if (results) {
          if (selected > 0) decSelected();
        }
      }

      // down
      if (keyCode === 40) {
        if (results) {
          if (selected < resultsCount - 1) incSelected();
        }
      }

      // down
      if (keyCode === 27) {
        this.set('searchTerms', '');
      }
    }
  }

  @action
  clear() {
    this.set('searchTerms', '');
  }

  @action
  goTo(result) {
    this.$('.map-search-input').blur();

    this.setProperties({
      selected: 0,
      focused: false,
    });

    this.get('onSelect')(result);
  }

  @action
  handleFocusIn() {
    this.set('focused', true);
  }

  @action
  handleFocusOut() {
    this.set('focused', false);
  }
}
