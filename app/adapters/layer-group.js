import DS from 'ember-data';

const { JSONAPIAdapter } = DS;

export default class LayerGroupAdapter extends JSONAPIAdapter {
  urlForFindAll() {
    return 'http://localhost:3000/v1/layer-groups';
  }

  urlForQuery() {
    return 'http://localhost:3000/v1/layer-groups';
  }
}
