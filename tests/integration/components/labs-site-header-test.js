import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | labs-site-header', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{labs-site-header}}`);
    const header = find('header');

    assert.equal(!!header, true);
  });

  test('the mobile menu is hidden', async function(assert) {
    await render(hbs`{{labs-site-header}}`);
    const menu = find('#responsive-menu.show-for-large');

    assert.equal(!!menu, true);
  });

  test('it unhides the menu when clicked', async function(assert) {
    await render(hbs`{{labs-site-header}}`);
    await click('.responsive-nav-toggler');
    const menu = find('#responsive-menu.show-for-large');

    assert.equal(!!menu, false);
  });
});
