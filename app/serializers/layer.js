import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default class LayerSerializer extends JSONAPISerializer {
  keyForAttribute(key) { return key; }
}
