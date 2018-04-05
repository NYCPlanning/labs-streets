import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layer-menu-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it opens and closes on click', async function(assert) {
    await render(hbs`{{layer-menu-item}}`);
    await click('.layer-menu-item-title');
    const content = find('.layer-menu-item-content');
    assert.equal(!!content, false);

    await click('.layer-menu-item-title');
    const content2 = find('.layer-menu-item-content');
    assert.equal(!!content2, true);
  });

  test('it yields content when open', async function(assert) {
    await render(hbs`
      {{#layer-menu-item}}
        template block text
      {{/layer-menu-item}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
