import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { classNames } from 'ember-decorators/component';

@classNames('legend-icon')
export default class LegendIconComponent extends Component {
  @argument
  @type('string')
  legendIcon = '';

  @argument
  @type('string')
  legendColor = '';
}
