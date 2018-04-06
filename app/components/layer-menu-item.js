import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';
import { classNames } from 'ember-decorators/component';

@classNames('layer-menu-item')
export default class LayerMenuItemComponent extends Component {
  @required
  @argument
  @type('string')
  title;

  @argument
  @type('boolean')
  active = true;

  @action
  toggle() {
    this.toggleProperty('active');
  }
}
