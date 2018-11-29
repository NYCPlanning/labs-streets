import { macro } from '@ember-decorators/object/computed';
import { computed } from '@ember/object';

export default macro((...keys) =>
  computed(...keys, {
    get() {
      const { model } = this;
      if (model) {
        return model.layerGroups.filterBy('visible').map((layerGroup) => {
          if (layerGroup.get('layerVisibilityType') === 'singleton') {
            return { id: layerGroup.get('id'), selected: layerGroup.get('selected.id') };
          }

          return layerGroup.get('id');
        }).sort();
      }

      return [];
    },
    set(key, params) {
      if (Array.isArray(params) && this.get('model') && params.length) {
        this.model.layerGroups.forEach((layerGroup) => {
          const foundParam = params.find(param => (param.id || param) === layerGroup.id);
          if (foundParam) {
            layerGroup.set('visible', true);

            if (foundParam.selected) {
              layerGroup.set('selected', foundParam.selected);
            }
          } else {
            layerGroup.set('visible', false);
          }
        });
      }
    },
  }));
