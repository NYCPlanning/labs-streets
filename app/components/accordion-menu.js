import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';

export default class AccordionMenuComponent extends Component {
  @argument
  open = true;

  @argument
  @required
  @type('string')
  title;

  @action
  toggleAccordion() {
    this.toggleProperty('open');
  }
}
