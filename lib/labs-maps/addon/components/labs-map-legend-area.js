import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { tagName, classNames, attribute } from 'ember-decorators/component';
import layout from '../templates/components/labs-map-legend-point';

@tagName('svg')
@classNames('legend-icon', 'line-array')
export default class LabsMapLegendPointComponent extends Component {
  layout = layout;

  @argument style = {};

  @attribute width = 6;
  @attribute height = 6;
  @attribute x = 5;
  @attribute y = 1;
  @attribute rx = 1;
  @attribute ry = 1;

  didInsertElement() {
    const groupElement = this.element.querySelector('rect');
    const style = this.get('style');
    Object.entries(style).forEach(([attr, value]) => {
      groupElement.setAttribute(attr, value);
    });
  }
}
