import { module, test } from 'qunit';
import { visit, click, triggerEvent, pauseTest, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | user toggles layers', function(hooks) {
  setupApplicationTest(hooks);

  test('User toggles layers', async function(assert) {
    await visit('/');
    await click('.layer-street-lines .layer-menu-item-title');
    await click('.layer-street-names .layer-menu-item-title');
    await click('.layer-name-changes .layer-menu-item-title');
    await click('.layer-city-map-alterations .layer-menu-item-title');

    const { x: xLower } = find('.noUi-handle-lower').getBoundingClientRect();
    const { x: xUpper } = find('.noUi-handle-upper').getBoundingClientRect();
    const { width } = find('.noUi-connect').getBoundingClientRect();

    await triggerEvent('.noUi-handle-lower', 'mousedown');
    await triggerEvent('.noUi-handle-lower', 'mousemove', { clientX: xLower + (width / 3) });
    await triggerEvent('.noUi-handle-lower', 'mouseup');

    const lower = find('.noUi-origin').style.left;
    assert.ok(lower !== '0%');

    await triggerEvent('.noUi-handle-upper', 'mousedown');
    await triggerEvent('.noUi-handle-upper', 'mousemove', { clientX: xUpper - (width / 3) });
    await triggerEvent('.noUi-handle-upper', 'mouseup');

    const upper = find('.noUi-origin:nth-child(1)').style.left;
    assert.ok(lower !== '100%');

    await triggerEvent('.noUi-connect', 'mousedown');
    await triggerEvent('.noUi-connect', 'mousemove', { clientX: width });
    await triggerEvent('.noUi-connect', 'mouseup');

    const slider = find('.noUi-connect');

    assert.ok(slider.style.right !== '100%');

    await click('.layer-zoning-districts .layer-menu-item-title');
    await click('.layer-special-purpose-districts .layer-menu-item-title');
  });
});