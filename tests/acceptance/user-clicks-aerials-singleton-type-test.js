import { module, test } from 'qunit';
import { visit, click, triggerEvent, pauseTest, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | user clicks aerials singleton type', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    await visit('/');
    await click('.layer-aerial-imagery .layer-menu-item-title');
    await click('.layer-group-radio-aerials-2006');
    const toggledRadio = await find('.layer-group-radio-aerials-2006 .fa-dot-circle-o');
    assert.ok(toggledRadio);

    assert.equal(currentURL(), '/about?aerials=true&selected-aerial=aerials-2006');

    await click('.layer-aerial-imagery .layer-menu-item-title');

    assert.equal(currentURL(), '/about?selected-aerial=aerials-2006');

    await click('.layer-aerial-imagery .layer-menu-item-title');

    assert.equal(currentURL(), '/about?aerials=true&selected-aerial=aerials-2006');

    // it should preserve previously toggled
    const toggledRadioAfter = await find('.layer-group-radio-aerials-2006 .fa-dot-circle-o');
    assert.ok(toggledRadioAfter);
  });
});
