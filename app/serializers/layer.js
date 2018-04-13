import DS from 'ember-data';

const { JSONSerializer } = DS;

export default class LayerSerializer extends JSONSerializer {
  attrs = {
    style: { embedded: 'always' },
  };

  // set style.id to also be the id for the layer
  normalize(typeClass, hash) {
    const mutatedHash = hash;
    mutatedHash.id = hash.style.id;

    return super.normalize(typeClass, mutatedHash);
  }
}
