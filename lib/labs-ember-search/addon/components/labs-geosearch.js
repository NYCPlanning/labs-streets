import Component from '@ember/component';
import fetch from 'fetch';
import { computed } from '@ember-decorators/object'; // eslint-disable-line
import { classNames } from 'ember-decorators/component';
import { action } from 'ember-decorators/object';
import { task, timeout } from 'ember-concurrency';
import layout from '../templates/components/labs-geosearch';

const DEBOUNCE_MS = 100;

@classNames('labs-geosearch')
export default class LabsGeosearchComponent extends Component {
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

  layout = layout
  searchTerms = '';
  selected = 0;
  focused = false;
  prevResults = null;
  loading = null;

  debouncedResults = task(function* (searchTerms) {
    if (searchTerms.length < 3) this.cancel();
    yield timeout(DEBOUNCE_MS);
    const URL = `https://zola-search-api.planninglabs.nyc/search?q=${searchTerms}`;

    this.set('loading', new Promise(function(resolve) {
      setTimeout(resolve, 500);
    }));

    return yield fetch(URL)
      .then(data => data.json())
      .then((resultList) => {
        this.set('prevResults', resultList);
        this.set('loading', null);
        return resultList;
      });
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

    // if (type === 'lot') {
    //   const { boro, block, lot } = bblDemux(result.bbl);
    //   this.set('searchTerms', result.label);
    //   this.transitionTo('lot', boro, block, lot);
    // }

    // if (type === 'zma') {
    //   this.set('searchTerms', result.label);
    //   this.transitionTo('zma', result.ulurpno);
    // }

    // if (type === 'zoning-district') {
    //   mainMap.set('shouldFitBounds', true);
    //   this.transitionTo('zoning-district', result.label);
    // }

    // if (type === 'neighborhood') {
    //   this.set('searchTerms', result.neighbourhood);
    //   const center = result.coordinates;
    //   mapInstance.flyTo({
    //     center,
    //     zoom: 13,
    //   });
    // }

    // if (type === 'address') {
    //   const center = result.coordinates;
    //   mainMap.set('currentAddress', center);

    //   this.set('searchTerms', result.label);
    //   this.saveAddress({ address: result.label, coordinates: result.coordinates });

    //   if (mapInstance) {
    //     mapInstance.flyTo({
    //       center,
    //       zoom: 15,
    //     });
    //     mapInstance.once('moveend', () => { this.transitionTo('index'); });
    //   }
    // }

    // if (type === 'special-purpose-district') {
    //   this.set('searchTerms', result.sdname);
    //   this.transitionTo('special-purpose-district', result.cartodb_id);
    // }

    // if (type === 'commercial-overlay') {
    //   this.set('searchTerms', result.label);
    //   this.transitionTo('commercial-overlay', result.overlay);
    // }
  }
}
