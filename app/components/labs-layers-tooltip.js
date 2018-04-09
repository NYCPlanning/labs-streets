import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { alias } from 'ember-decorators/object/computed';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';

export default class LabsLayersTooltipComponent extends Component {
  @computed('top', 'left')
  get style() {
    const position = this.getProperties('top', 'left');
    return `top: ${position.top}px; left: ${position.left}px;`;
  }

  @required
  @type('number')
  top = 0;

  @required
  @type('number')
  left = 0;
}
