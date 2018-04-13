import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';

const basicLayer = {
  "id": "citymap-street-treatments-line",
  "style":{
    "id": "citymap-street-treatments-line",
    "type": "line",
    "source": "digital-citymap",
    "source-layer": "citymap",
    "filter": ["all"],
    "paint": {},
  }
};

module('Integration | Component | slider-filter', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    this.set('layer', basicLayer);
    this.set('map', {})
    await render(hbs`{{slider-filter layer=layer map=map}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  skip('it renders with model', async function(assert) {
    let store = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('layer', basicLayer));

    this.set('layer', model);
    this.set('map', {});
    await render(hbs`{{slider-filter layer=layer map=map}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  // test('it fails with improper format filter', async function(assert) {
  //   let store = this.owner.lookup('service:store');
  //   let model = run(() => store.createRecord('layer', basicLayer));

  //   this.set('layer', model);
  //   await render(hbs`{{slider-filter layer=layer}}`);

  //   assert.equal(this.element.textContent.trim(), '');
  // });
});
