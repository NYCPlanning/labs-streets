import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { tagName, classNames, attribute } from 'ember-decorators/component';
import layout from '../templates/components/labs-map-legend-line';

@tagName('svg')
@classNames('legend-icon', 'line-array')
export default class LabsMapLegendLineComponent extends Component {
  layout = layout

  @attribute height = 10;
  @attribute width = 17;
  @attribute viewBox = '0 0 17 10';
  @attribute preserveAspectRatio = 'xMinYMid';

  @argument style = {};

  didInsertElement() {
    const groupElement = this.element.querySelector('path');
    const style = this.get('style');
    Object.entries(style).forEach(([attr, value]) => {
      groupElement.setAttribute(attr, value);
    });
  }
}
