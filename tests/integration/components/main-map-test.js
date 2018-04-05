import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | main-map', function(hooks) {
  setupRenderingTest(hooks);

  // skip('it renders', async function(assert) {
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.set('myAction', function(val) { ... });

  //   await render(hbs`{{main-map}}`);

  //   assert.equal(this.element.textContent.trim(), '');

  //   // Template block usage:
  //   await render(hbs`
  //     {{#main-map}}
  //       template block text
  //     {{/main-map}}
  //   `);

  //   assert.equal(this.element.textContent.trim(), 'template block text');
  // });

  test('it shows a map', async function(assert) {
    await render(hbs`{{main-map}}`);
    const node = await find('.mapboxgl-canvas-container canvas');

    assert.equal(!!node, true);
  });
});
