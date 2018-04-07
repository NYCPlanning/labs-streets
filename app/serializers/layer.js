import DS from 'ember-data';
import ApplicationSerializer from '../serializers/application';

const { EmbeddedRecordsMixin } = DS;
const EmbeddableSerializer = ApplicationSerializer.extend(EmbeddedRecordsMixin);

export default class LayerSerializer extends EmbeddableSerializer {
  attrs = {
    style: { embedded: 'always' },
  };
}
