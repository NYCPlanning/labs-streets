import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';
import { htmlSafe } from '@ember/string';
import layout from '../templates/components/labs-layers-tooltip';

export default class LabsLayersTooltipComponent extends Component {
  @computed('top', 'left', 'offset')
  get style() {
    const position = this.getProperties('top', 'left', 'offset');
    return htmlSafe(`
      top: ${position.top + position.offset}px; 
      left: ${position.left + position.offset}px; 
      pointer-events: none;
    `);
  }

  layout = layout

  @argument
  offset = 20;

  @required
  @argument
  @type('number')
  top = 0;

  @required
  @argument
  @type('number')
  left = 0;

  @argument
  feature;

  @argument
  layer;
}
