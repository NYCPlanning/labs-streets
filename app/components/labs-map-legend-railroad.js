import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import layout from '../templates/components/labs-map-legend-railroad';

export default
class LabsMapLegendLineComponent extends Component {
  tagName = 'use';
  classNames = ['legend-icon', 'line-array'];
  layout = layout;

  attributeBindings = ['height', 'width', 'viewBox', 'preserveAspectRatio']

  height = 10;
  width = 17;
  viewBox = '0 0 17 10';
  preserveAspectRatio = 'xMinYMid';

  @argument style = {};

  didInsertElement() {
    const groupElement = this.element.querySelector('.cross');
    const style = this.get('style');
    Object.entries(style).forEach(([attr, value]) => {
      groupElement.setAttribute(attr, value);
    });
  }
}
