import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | accordion-menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it toggles closed', async function(assert) {
    await render(hbs`{{accordion-menu}}`);
    await click('.switch');
    const accordionContent = await find('.accordion-content');

    assert.equal(!!accordionContent, false);
  });

  test('it toggles open', async function(assert) {
    await render(hbs`{{accordion-menu visible=false}}`);
    await click('.switch');
    const accordionContent = await find('.accordion-content');

    assert.equal(!!accordionContent, true);
  });
});
