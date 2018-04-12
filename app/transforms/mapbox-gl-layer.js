import DS from 'ember-data';
import { assign } from '@ember/polyfills';

const { Transform } = DS;

export default class MapboxGlStyleTransform extends Transform {
  deserialize(serialized) {
    const layerSpec = {
      layout: {
        visibility: 'visible',
      },
      paint: {},
      filter: ['all'],
    };

    return assign(layerSpec, serialized);
  }

  serialize(deserialized) {
    return deserialized;
  }
}
