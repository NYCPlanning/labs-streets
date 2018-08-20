import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';
import layout from '../../templates/components/labs-ui/info-tooltip';

export default class InfoTooltip extends Component {
  layout = layout;
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
