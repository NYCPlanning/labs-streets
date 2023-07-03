import Component from '@ember/component';
import { service } from '@ember-decorators/service';
// import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';


export default class LookupLayerGroupComponent extends Component {
  constructor() {
    super();

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
