import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { alias } from 'ember-decorators/object/computed';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import layout from '../templates/components/labs-layers';

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

  @computed('hoveredFeature')
  get hoveredLayer() {
    const feature = this.get('hoveredFeature');

    if (feature) {
      return this.get('layers')
        .findBy('id', feature.layer.id);
    }

    return null;
  }

  layout=layout

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

  @argument
  toolTipComponent = 'labs-layers-tooltip';
  hoveredFeature = null;
  mousePosition = null;

  @argument
  highlightedFeatureLayer = {
    id: 'highlighted-feature',
    type: 'line',
    source: 'hovered-feature',
    paint: {
      'line-color': '#ffff00',
      'line-opacity': 0.3,
      'line-width': {
        stops: [
          [8, 4],
          [11, 7],
        ],
      },
    },
  }

  @action
  handleLayerMouseClick(e) {
    const [feature] = e.features;
    const foundLayer = this.get('layers').findBy('id', feature.layer.id);
    const layerClickEvent = this.get('onLayerClick');
    if (layerClickEvent && feature) {
      layerClickEvent(feature, foundLayer);
    }
  }

  @action
  handleLayerMouseMove(e) {
    const map = this.get('map');
    const [feature] = e.features;
    const foundLayer = this.get('layers').findBy('id', feature.layer.id);

    const { highlightable, tooltipable } =
      foundLayer.getProperties('highlightable', 'tooltipable');

    // this layer-specific event should always be called
    // if it's available
    const mouseMoveEvent = this.get('onLayerMouseMove');
    if (mouseMoveEvent && feature) {
      mouseMoveEvent(e, foundLayer);
    }

    // if layer is set for this behavior
    if (highlightable || tooltipable) {
      // set the hovered feature
      this.setProperties({
        hoveredFeature: feature,
        mousePosition: e.point,
      });

      map.getSource('hovered-feature').setData(feature);
      map.getCanvas().style.cursor = 'pointer';
    }
  }

  @action
  handleLayerMouseLeave() {
    const map = this.get('map');
    this.set('hoveredFeature', null);
    map.getCanvas().style.cursor = '';

    this.setProperties({
      hoveredFeature: null,
      mousePosition: null,
    });

    const mouseLeaveEvent = this.get('onLayerMouseLeave');
    if (mouseLeaveEvent) {
      mouseLeaveEvent();
    }
  }
}
