import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';
import { classNames } from '@ember-decorators/component';
import layout from '../../templates/components/labs-ui/layer-menu-item';

@classNames('layer-menu-item')
export default class LayerMenuItemComponent extends Component {
  constructor() {
    super();
    this.get('didInit')(this);
  }

  layout = layout;

  @required
  @argument
  @type('string')
  title;

  @argument
  legendIcon = '';

  @argument
  legendColor = '';

  @argument
  @type('string')
  tooltip = '';

  @argument
  @type('boolean')
  active = true;

  @argument
  didInit = () => {}

  @argument
  willDestroyHook = () => {}

  willDestroy() {
    this.get('willDestroyHook')(this);
  }

  @action
  toggle() {
    this.toggleProperty('active');
  }
}

