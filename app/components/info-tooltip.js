import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';

export default class InfoTooltip extends Component {
  classNames=['tooltip float-right primary-color'];

  @required
  @argument
  @type('string')
  tip

  @argument
  iconName = 'info-circle'

  @argument
  side = 'left'

  tagName = 'span'
}
