import { module, test } from 'qunit';
import { visit, currentURL, click, pauseTest, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | user can navigate with site header', function(hooks) {
  setupApplicationTest(hooks);

  test('it hides the menu after an item is selected', async function(assert) {
    await visit('/');

    // click menu button that appears on small screens
    await click('.responsive-nav-toggler');

    // click menu item, navigate, should close menu for small screens
    await click('.menu-list-item:first-child .menu-list-item-link');
    const menu = await find('#responsive-menu.show-for-large');
    assert.equal(!!menu, true);
  });
});
