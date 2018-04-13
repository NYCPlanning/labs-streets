import DS from 'ember-data';

const { JSONSerializer } = DS;

export default class LayerSerializer extends JSONSerializer {
  // set style.id to also be the id for the layer
  normalize(typeClass, hash) {
    const mutatedHash = hash;
    mutatedHash.id = hash.style.id;

    // enforce mapboxgl style spec
    const layerSpec = {
      layout: {
        visibility: 'visible',
      },
      paint: {},
      filter: ['all'],
    };

    if (!mutatedHash.style.layout) {
      mutatedHash.style.layout = layerSpec.layout;
    }

    if (!mutatedHash.style.paint) {
      mutatedHash.style.paint = layerSpec.paint;
    }

    if (!mutatedHash.style.filter) {
      mutatedHash.style.filter = layerSpec.filter;
    }

    return super.normalize(typeClass, mutatedHash);
  }
}
