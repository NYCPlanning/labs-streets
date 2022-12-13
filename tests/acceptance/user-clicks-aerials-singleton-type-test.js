import { module, todo } from 'qunit';
import { visit, click, triggerEvent, pauseTest, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | user clicks aerials singleton type', function(hooks) {
  setupApplicationTest(hooks);

  // Flaky. Sometimes failing after PR #https://github.com/NYCPlanning/labs-streets/pull/334// Failing after PR #https://github.com/NYCPlanning/labs-streets/pull/334
  todo('visiting /', async function(assert) {
    await visit('/');
    await click('.layer-aerial-imagery .layer-group-toggle-label');
    await click('.layer-group-radio-aerials-2006');
    const toggledRadio = await find('.layer-group-radio-aerials-2006.silver');
    assert.ok(toggledRadio);

    assert.equal(currentURL(), '/about?layer-groups=%5B%7B%22id%22%3A%22aerials%22%2C%22selected%22%3A%22aerials-2006%22%7D%2C%22amendments%22%2C%22citymap%22%2C%22pierhead-bulkhead-lines%22%2C%22street-centerlines%22%5D');

    await click('.layer-aerial-imagery .layer-group-toggle-label');

    assert.equal(currentURL(), '/about?layer-groups=%5B%22amendments%22%2C%22citymap%22%2C%22pierhead-bulkhead-lines%22%2C%22street-centerlines%22%5D');
  });
});
