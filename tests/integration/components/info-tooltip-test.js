import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | info-tooltip', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a hidden tooltip', async function(assert) {
    await render(hbs`
      <div></div>
      {{info-tooltip tip="O Hai"}}
    `);

    console.log(this.element.textContent)
    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
