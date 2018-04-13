import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import { required } from '@ember-decorators/argument/validation';
import moment from 'moment';

const fromEpoch = function(number, format) {
  return moment(number, 'X').format(format);
};

const defaultStart = [-2082931200, 1518825600];

export default class SliderFilterComponent extends Component {
  @required
  @argument
  map;

  @required
  @argument
  layer;

  start = defaultStart
  min = defaultStart[0]
  max = defaultStart[1]

  format = {
    to: number => fromEpoch(number, 'YYYY'),
    from: number => fromEpoch(number, 'YYYY'),
  }

  @action
  sliderChanged([min, max]) {
    const filter = this.generateExpression(min, max);
    const map = this.get('map');

    // const layer = this.get('layer');
    // layer.set('filter', filter);

    // TODO: fix in ember-mapbox-gl, where filters do not trigger
    // updates in the data
    map.setFilter(this.get('layer.id'), filter); // <-- this works, but uses map directly
  }

  generateExpression(min, max) {
    return ['all', ['>=', 'effective', min], ['<=', 'effective', max]];
  }
}
