import carto from 'carto-promises-utility/utils/carto';
import { isArray } from '@ember/array';

const { getVectorTileTemplate } = carto;

export default function normalizeCartoVectors(pseudoMapboxGlSources = []) {
  // coerce to an array
  const iterable = isArray(pseudoMapboxGlSources) ? pseudoMapboxGlSources : [pseudoMapboxGlSources];

  // normalize into mapbox-gl source spec
  return Promise.all(iterable.map((source) => {
    const { id, minzoom = 0, 'source-layers': sourceLayers } = source;

    return getVectorTileTemplate(sourceLayers)
      .then(template => ({
        id,
        type: 'vector',
        tiles: [template],
        minzoom,
      }));
  }));
}
