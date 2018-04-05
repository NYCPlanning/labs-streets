import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import { type } from '@ember-decorators/argument/type';

export default class LayerMenuItemComponent extends Component {
  @argument
  @type('boolean')
  active = true;

  @action
  toggle() {
    this.toggleProperty('active');
  }
}
