import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';

export default class AccordionMenuComponent extends Component {
  @argument
  visible = true;

  @action
  toggleAccordion() {
    this.toggleProperty('visible');
  }
}
