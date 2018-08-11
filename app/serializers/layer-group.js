import DS from 'ember-data';

const { JSONAPISerializer } = DS;
// const EmbeddableSerializer = JSONAPISerializer.extend(EmbeddedRecordsMixin);

export default class LayerGroupSerializer extends JSONAPISerializer {
  // keyForAttribute(key) { return key; }
}
