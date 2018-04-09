import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { type } from '@ember-decorators/argument/type';

export default class LabsLayersTooltipComponent extends Component {
  @computed('top', 'left')
  get style() {
    const position = this.getProperties('top', 'left');
    return `top: ${position.top + 20}px; left: ${position.left + 20}px; pointer-events: none;`;
  }

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
