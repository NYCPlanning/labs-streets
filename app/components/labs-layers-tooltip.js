import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';

export default class LabsLayersTooltipComponent extends Component {
  @computed('top', 'left', 'offset')
  get style() {
    const position = this.getProperties('top', 'left', 'offset');
    return `top: ${position.top + position.offset}px; left: ${position.left + position.offset}px; pointer-events: none;`;
  }

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
