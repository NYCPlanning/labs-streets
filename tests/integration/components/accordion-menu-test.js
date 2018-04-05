import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | accordion-menu', function(hooks) {
  setupRenderingTest(hooks);

  test('it toggles closed', async function(assert) {
    await render(hbs`{{accordion-menu title='Foo'}}`);
    await click('.accordion-title');
    const accordionContent = await find('.accordion-content');

    assert.equal(!!accordionContent, false);
  });

  test('it toggles open', async function(assert) {
    await render(hbs`{{accordion-menu title='Foo' open=false}}`);
    await click('.accordion-title');
    const accordionContent = await find('.accordion-content');

    assert.equal(!!accordionContent, true);
  });

  test('it renders the title', async function(assert) {
    await render(hbs`{{accordion-menu open=false title='Foo'}}`);
    const title = await find('.accordion-title').textContent.trim();

    assert.equal(title, 'Foo');
  });

  test('it yields the block', async function(assert) {
    await render(hbs`{{#accordion-menu title='Foo'}}Bar{{/accordion-menu}}`);
    const accordionContent = await find('.accordion-content').textContent.trim();

    assert.equal(accordionContent, 'Bar');
  });

  skip('it shows a count of active children', async function(assert) {

  });
});
