import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action, computed } from '@ember-decorators/object';
import { oneWay } from 'ember-decorators/object/computed';
import { required } from '@ember-decorators/argument/validation';
import moment from 'moment';

const defaultFormat = 'YYYY-MM-DD';

const fromEpoch = function(number, format = defaultFormat) {
  return moment(number).format(format);
};

export default class SliderFilterComponent extends Component {
  @computed('layer.filter')
  get min() {
    const [, [,, min] = []] = this.get('layer.filter');
    return min;
  }

  @computed('layer.filter')
  get max() {
    const [,, [,, max] = []] = this.get('layer.filter');
    return max;
  }

  @computed('startMin', 'startMax')
  get start() {
    const { min, max } =
      this.getProperties('min', 'max');
    return [min, max];
  }

  @required
  @argument
  layer;

  format = {
    to: number => fromEpoch(number, 'YYYY-MM'),
    from: number => fromEpoch(number, 'YYYY-MM'),
  }

  @oneWay('min')
  startMin

  @oneWay('max')
  startMax

  @action
  update([min, max]) {
    const filter = this.generateExpression(min, max);
    this.set('layer.filter', filter);
  }

  generateExpression(min, max) {
    return ['all', ['>=', 'id', min], ['<=', 'id', max]];
  }
}
