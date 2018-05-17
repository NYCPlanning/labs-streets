import DS from 'ember-data';
import { attr } from 'ember-decorators/data';

const { Model } = DS;

export default Model.extend({
  @attr('string') type: null,
  @attr() 'source-layers': null,
  @attr() tiles: null,
  @attr('number') tileSize: null,
});
