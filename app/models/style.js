import DS from 'ember-data';
import { attr } from 'ember-decorators/data';

const { Model } = DS;

export default class StyleModel extends Model {
  @attr('string') type
  @attr('string') source
  @attr('string')['source-layer']
  @attr() paint
}
