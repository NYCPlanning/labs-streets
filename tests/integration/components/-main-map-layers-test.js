import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | main-map-layers', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('initOptions', {
      style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json',
      zoom: 10,
      center: [-74.1197, 40.6976],
    });

    this.set('onLayerClick', (e) => {

    });

    this.set('handleMapLoad', (map) => {
      console.log(map);
    });

    await render(hbs`
      {{#main-map 
        initOptions=initMapOptions
        mapLoaded=(action handleMapLoad) as |map|}}
        {{map.labs-layers
          onLayerClick=(action onLayerClick)}}
      {{/main-map}}
    `);

    assert.equal(this.element.textContent.trim(), 'Missing Mapbox GL JS CSS');

  });
});
