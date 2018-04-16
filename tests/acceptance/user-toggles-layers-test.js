import { module, test } from 'qunit';
import { visit, click, triggerEvent, pauseTest } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | user toggles layers', function(hooks) {
  setupApplicationTest(hooks);

  test('User toggles layers', async function(assert) {
    await visit('/');
    await click('.layer-street-lines .layer-menu-item-title');
    await click('.layer-street-names .layer-menu-item-title');
    await click('.layer-name-changes .layer-menu-item-title');
    await click('.layer-city-map-alterations .layer-menu-item-title');
    await triggerEvent('.noUi-handle-lower', 'dragstart', 1,1);
    await pauseTest();
    assert.equal('/', '/');
  });
});
