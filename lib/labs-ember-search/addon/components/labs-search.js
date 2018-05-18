import Component from '@ember/component';
import fetch from 'fetch';
import { computed, action } from '@ember-decorators/object'; // eslint-disable-line
import { classNames } from '@ember-decorators/component';
import { task, timeout } from 'ember-concurrency';
import { argument } from '@ember-decorators/argument';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import { getOwner } from '@ember/application';
import { Promise } from 'rsvp';
import layout from '../templates/components/labs-search';

const DEBOUNCE_MS = 100;

@classNames('labs-geosearch')
export default class LabsSearchComponent extends Component {
  constructor() {
    super();
    const { host = 'https://zola-api.planninglabs.nyc', route = 'search' } =
      getOwner(this).resolveRegistration('config:environment')['labs-search'];

    this.set('host', host);
    this.set('route', route);
  }

  @argument
  @type(Action)
  onSelect = () => {};

  @argument
  @type(Action)
  onHoverResult = () => {};

  @argument
  @type(Action)
  onHoverOut = () => {};

  @argument
  @type(Action)
  onClear = () => {};

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
    return `${host}/${route}?helpers[]=geosearch&helpers[]=city-map-street-search&helpers[]=city-map-alteration&q=${searchTerms}`;
  }

  @argument
  host = 'https://zola-search-api.planninglabs.nyc';

  @argument
  route = 'search';

  @argument
  typeTitleLookup = {
    lot: 'Lot',
  }

  @argument
  searchTerms = '';

  layout = layout
  selected = 0;
  _focused = false;
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
    const mergedWithTitles = resultList.map((result, index) => {
      const mutatedResult = result;
      mutatedResult.id = index;
      mutatedResult.typeTitle = this.get(`typeTitleLookup.${result.type}`) || 'Result';
      return mutatedResult;
    });

    this.set('currResults', mergedWithTitles);
    this.set('loading', null);

    return mergedWithTitles;
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

      // escape
      if (keyCode === 27) {
        this.send('clear');
        this.send('handleFocusOut');
      }
    }
  }

  @action
  clear() {
    this.set('searchTerms', '');
    this.get('onClear')();
  }

  @action
  goTo(result) {
    this.$('.map-search-input').blur();

    this.setProperties({
      selected: 0,
      searchTerms: result.label,
      _focused: false,
      currResults: [],
    });

    this.get('onSelect')(result);
  }

  @action
  handleFocusIn() {
    this.set('_focused', true);
  }

  @action
  handleHoverResult(result) {
    this.get('onHoverResult')(result);
  }

  @action
  handleFocusOut() {
    this.set('_focused', false);
  }

  @action
  handleHoverOut() {
    this.get('onHoverOut')();
  }
}
