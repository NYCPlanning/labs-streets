import DS from 'ember-data';
import { merge } from '@ember/polyfills';

const { Transform } = DS;

export default class MapboxGlStyleTransform extends Transform {
  deserialize(serialized) {
    const layerSpec = {
      layout: {
        visibility: 'visible',
      },
    };

    return merge(serialized, layerSpec);
  }

  serialize(deserialized) {
    return deserialized;
  }
}
