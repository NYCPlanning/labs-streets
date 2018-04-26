import carto from 'carto-promises-utility/utils/carto';
import { isArray } from '@ember/array';
import { getProperties } from '@ember/object';
import { Promise } from 'rsvp';

const { getVectorTileTemplate } = carto;

export default function normalizeCartoVectors(pseudoMapboxGlSources = []) {
  // coerce to an array
  const iterable = isArray(pseudoMapboxGlSources) ? pseudoMapboxGlSources : [pseudoMapboxGlSources];

  // normalize into mapbox-gl source spec
  return Promise.all(iterable.map((source) => {
    const {
      id,
      type,
      minzoom = 0,
      'source-layers': sourceLayers,
    } = getProperties(source, 'id', 'type', 'minzoom', 'source-layers');

    if (type !== 'cartovector') {
      return new Promise((resolve) => {
        const { tiles, tileSize } = getProperties(source, 'tiles', 'tileSize');
        resolve({
          id,
          type,
          tiles,
          tileSize,
        });
      });
    }

    return getVectorTileTemplate(sourceLayers)
      .then(template => ({
        id,
        type: 'vector',
        tiles: [template],
        minzoom,
      }));
  }));
}
