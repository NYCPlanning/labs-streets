import DS from 'ember-data';

const { JSONAPIAdapter } = DS;

export default class LayerGroupAdapter extends JSONAPIAdapter {
  urlForFindAll() {
    return '/layer-groups.json';
  }
}
