import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import layout from '../templates/components/labs-map-legend';

export default class LabsMapLegendComponent extends Component {
  layout = layout;

  @argument
  model;
}
