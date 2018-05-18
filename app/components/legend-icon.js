import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import { type } from '@ember-decorators/argument/type';
import { classNames } from '@ember-decorators/component';

@classNames('legend-icon')
export default class LegendIconComponent extends Component {
  @computed('legendColor')
  get legendColorStyle() {
    const color = this.get('legendColor');
    return `color: ${color};`;
  }

  @computed('legendColor')
  get legendBackgroundColorStyle() {
    const color = this.get('legendColor');
    return `background-color: ${color};`;
  }

  @computed('legendColor')
  get legendBorderColorStyle() {
    const color = this.get('legendColor');
    return `border-color: ${color};`;
  }

  @argument
  @type('string')
  legendIcon = '';

  @argument
  @type('string')
  legendColor = '';
}
