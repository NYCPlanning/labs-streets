import mapboxGlMap from 'ember-mapbox-gl/components/mapbox-gl';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { alias } from 'ember-decorators/object/computed';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import { required, immutable } from '@ember-decorators/argument/validation';

export default class MainMapComponent extends mapboxGlMap {
  @argument
  model = null;

  @alias('model.layerGroups')
  layerGroups;

  @alias('model.layers')
  layers;

  @required
  @immutable
  @argument
  @type(Action)
  onLayerClick;

  @computed('layers.@each.visible')
  get visibleLayers() {
    return this.get('layers')
      .filterBy('visible', true);
  }

  @action
  handleMouseClick(e) {
    const map = this.get('map');
    if (map) {
      // must be clickable and visible layers
      const visibleLayers = this.get('visibleLayers').mapBy('id');
      const [feature] = map.queryRenderedFeatures(e.point, { layers: visibleLayers });
      const { layer: { id: layerId } } = feature;

      // there will be many of these
      if (layerId === 'citymap-amendments-fill') {
        const { properties: { altmappdf = '' } } = feature;
        const clean = altmappdf.split('/').pop();
        window.open(`https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${clean}`);
      }
    }
  }
}
