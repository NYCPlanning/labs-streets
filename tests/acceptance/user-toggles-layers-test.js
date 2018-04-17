import { module, test } from 'qunit';
import { visit, click, triggerEvent, pauseTest } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { drag } from '../../tests/helpers/drag-drop';

module('Acceptance | user toggles layers', function(hooks) {
  setupApplicationTest(hooks);

  test('User toggles layers', async function(assert) {
    await visit('/');
    await click('.layer-street-lines .layer-menu-item-title');
    await click('.layer-street-names .layer-menu-item-title');
    await click('.layer-name-changes .layer-menu-item-title');
    await click('.layer-city-map-alterations .layer-menu-item-title');
    // await triggerEvent('.noUi-handle-lower', 'dragstart', event);

    await drag('.noUi-handle-lower', {
      drop: '.noUi-ltr',
      dragOverMoves: [
        [{ clientX: 1, clientY: 20 }],
        [{ clientX: -50, clientY: 20 }]
      ],
    });

    await pauseTest();
    assert.equal('/', '/');
  });
});
