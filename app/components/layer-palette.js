import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
// import { action } from '@ember-decorators/object';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';

import LayerGroup from '../models/layer-group';

export default class LayerPaletteComponent extends Component {
  @argument
  @required
  @type(LayerGroup)
  layerGroups = LayerGroup;
}
