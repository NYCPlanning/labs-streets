import DS from 'ember-data';

const { JSONAPIAdapter } = DS;

export default class SourceAdapter extends JSONAPIAdapter {
  urlForFindAll() {
    return '/sources.json';
  }
}
