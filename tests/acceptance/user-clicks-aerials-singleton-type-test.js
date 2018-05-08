import { module, test } from 'qunit';
import { visit, click, triggerEvent, pauseTest, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | user clicks aerials singleton type', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    await visit('/');
    await click('.layer-aerial-imagery .switch');
    await click('.layer-group-radio-aerials-2006');
    const toggledRadio = await find('.layer-group-radio-aerials-2006 .fa-dot-circle-o');
    assert.ok(toggledRadio);

    assert.equal(currentURL(), '/?layerGroups=special-purpose-districts%2Cfloodplain-efirm2007%2Cfloodplain-pfirm2015%2Cpierhead-bulkhead-lines%2Ccitymap%2Camendments%2Cstreet-centerlines%2Caerials%2Ctax-lots&selected-aerial=aerials-2006');

    await click('.layer-aerial-imagery .layer-menu-item-title');

    assert.equal(currentURL(), '/?layerGroups=special-purpose-districts%2Cfloodplain-efirm2007%2Cfloodplain-pfirm2015%2Cpierhead-bulkhead-lines%2Ccitymap%2Camendments%2Cstreet-centerlines%2Ctax-lots');

    await click('.layer-aerial-imagery .layer-menu-item-title');

    assert.equal(currentURL(), '/?layerGroups=special-purpose-districts%2Cfloodplain-efirm2007%2Cfloodplain-pfirm2015%2Cpierhead-bulkhead-lines%2Ccitymap%2Camendments%2Cstreet-centerlines%2Caerials%2Ctax-lots');

    // it should preserve previously toggled
    // UPDATE: This is no longer available, TODO
    // const toggledRadioAfter = await find('.layer-group-radio-aerials-2006 .fa-dot-circle-o');
    // assert.ok(toggledRadioAfter);
  });
});
