import DS from 'ember-data';
import config from '../config/environment';

const { host, namespace } = config;
const { JSONAPIAdapter } = DS;

export default class LayerGroupAdapter extends JSONAPIAdapter {
  host = host;
  namespace = namespace;
}
