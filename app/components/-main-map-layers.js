import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { alias } from 'ember-decorators/object/computed';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';

export default class MainMapLayersComponent extends Component {
  constructor(...args) {
    super(...args);

    const map = this.get('map');

    // add source for highlighted-feature
    map
      .addSource('hovered-feature', this.get('hoveredFeatureSource'));

    const sources = this.get('sources');
    sources.forEach((source) => {
      map.addSource(source.id, source);
    });
  }

  @argument
  @type(Action)
  onLayerClick = () => {};

  @argument
  @type(Action)
  onLayerMouseMove = () => {};

  @argument
  @type(Action)
  onLayerMouseLeave = () => {};

  @computed('hoveredFeature')
  get hoveredFeatureSource() {
    const feature = this.get('hoveredFeature');
    return {
      type: 'geojson',
      data: feature,
    };
  }

  @computed('layers.@each.visible')
  get visibleLayers() {
    return this.get('layers')
      .filterBy('visible', true);
  }

  @required
  @argument
  model;

  @required
  @argument
  map;

  @alias('model.layers')
  layers;

  @alias('model.sources')
  sources;

  toolTipComponent = 'labs-layers-tooltip';
  hoveredFeature = null;

  @argument
  highlightedFeatureLayer = {
    id: 'highlighted-feature',
    type: 'line',
    source: 'hovered-feature',
    paint: {
      'line-color': '#555555',
      'line-opacity': 0.8,
      'line-width': {
        stops: [
          [8, 2],
          [11, 4],
        ],
      },
    },
  }

  @action
  handleLayerMouseClick(e) {
    const [feature] = e.features;

    const layerClickEvent = this.get('onLayerClick');
    if (layerClickEvent && feature) {
      layerClickEvent(feature);
    }
  }

  @action
  handleLayerMouseMove(e) {
    const [feature] = e.features;
    const map = this.get('map');

    // set the hovered feature
    this.set('hoveredFeature', feature);
    map.getSource('hovered-feature').setData(feature);
    map.getCanvas().style.cursor = 'pointer';

    const mouseMoveEvent = this.get('onLayerMouseMove');
    if (mouseMoveEvent && feature) {
      mouseMoveEvent(e);
    }
  }

  @action
  handleLayerMouseLeave() {
    const map = this.get('map');
    this.set('hoveredFeature', null);
    map.getCanvas().style.cursor = '';

    const mouseLeaveEvent = this.get('onLayerMouseLeave');
    if (mouseLeaveEvent) {
      mouseLeaveEvent();
    }
  }
}
