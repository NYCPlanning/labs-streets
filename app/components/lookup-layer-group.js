import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';


export default class LookupLayerGroupComponent extends Component {
  init(...args) {
    super.init(...args);

    const recordIdentifier = this.get('for');
    const foundRecord = this.get('store').peekRecord('layer-group', recordIdentifier);
    if (foundRecord) {
      this.set('model', foundRecord);
    }
  }

  @service store;

  @required
  @argument
  @type('string')
  for = '';
}
