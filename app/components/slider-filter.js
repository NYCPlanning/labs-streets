import Component from '@ember/component';
import { action } from '@ember/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import moment from 'moment';

const fromEpoch = function(number, format) {
  return moment(number, 'X').utc().format(format);
};

// Jan 1, 1903 to present
const defaultStart = [-2114380799, parseInt(moment().utc().endOf('year').format('X'), 10)];

export default class SliderFilterComponent extends Component {
  // @required
  // @argument
  // layer;

  // start = defaultStart
  // min = defaultStart[0]
  // max = defaultStart[1]

  // format = {
  //   to: number => fromEpoch(number, 'YYYY'),
  //   from: number => fromEpoch(number, 'YYYY'),
  // }

  // @action
  // sliderChanged([min, max]) {
  //   const layer = this.get('layer');

  //   // because the slider returns unix epochs based on its own step increment,
  //   // get the startOf() the min timestamp's year, and the endOf() of the max timestamp's year
  //   const minStart = parseInt(moment(min, 'X').utc().startOf('year').format('X'), 10);
  //   const maxEnd = parseInt(moment(max, 'X').utc().endOf('year').format('X'), 10);

  //   const filter = this.generateExpression(minStart, maxEnd);
  //   layer.set('filter', filter);
  // }

  // generateExpression(min, max) {
  //   return ['all', ['>=', 'effective', min], ['<=', 'effective', max]];
  // }
}
