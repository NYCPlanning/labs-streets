import { module, test, skip } from 'qunit';
import { visit, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | visit index', function(hooks) {
  setupApplicationTest(hooks);

  skip('user visits index and sees a map', async function(assert) {
    await visit('/');
    const node = await find('.mapboxgl-canvas-container canvas');

    assert.equal(!!node, true);
    assert.equal(currentURL(), '/');
  });
});
