import Component from '@ember/component';
import { computed } from '@ember/object';
import { argument } from '@ember-decorators/argument';
import mustache from 'mustache';

export default class TooltipRenderer extends Component {
  @computed('feature', 'template')
  get renderedText() {
    return mustache.render(this.template, this.properties);
  }

  @argument
  feature = {}

  @argument
  template = ''
}
