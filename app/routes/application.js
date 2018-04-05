import Route from '@ember/routing/route';
import normalizeCartoVectors from '../utils/normalize-carto-vectors';

const bulkSource = {
  id: 'bulk-headlines',
  type: 'cartovector',
  'source-layers': [
    {
      id: 'bulk-headlines',
      sql: 'SELECT the_geom_webmercator, sourceimag, cartodb_id FROM citymap_bulkheadlines_v0',
    },
  ],
};

export default class ApplicationRoute extends Route {
  model() {
    return normalizeCartoVectors([bulkSource]);
  }
}
