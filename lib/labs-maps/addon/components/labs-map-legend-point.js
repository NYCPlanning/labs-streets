import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { tagName, classNames, attribute } from 'ember-decorators/component';
import layout from '../templates/components/labs-map-legend-point';

@tagName('svg')
@classNames('legend-icon', 'line-array')
export default class LabsMapLegendPointComponent extends Component {
  layout = layout;

  @argument style = {};

  @attribute cx = 8;
  @attribute cy = 4;
  @attribute r = 2.5;

  didInsertElement() {
    const groupElement = this.element.querySelector('circle');
    const style = this.get('style');
    Object.entries(style).forEach(([attr, value]) => {
      groupElement.setAttribute(attr, value);
    });
  }
}
