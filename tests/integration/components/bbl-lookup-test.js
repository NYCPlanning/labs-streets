import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, fillIn, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | bbl-lookup', function(hooks) {
  setupRenderingTest(hooks);

  test('it toggles open and closed', async function(assert) {
    await render(hbs`{{bbl-lookup}}`);

    // it opens
    await click('.bbl-lookup-toggle');
    const openForm = await find('.bbl-lookup-form');
    assert.equal(!!openForm, true);

    // it closes
    await click('.bbl-lookup-toggle');
    const closedForm = await find('.bbl-lookup-form');
    assert.equal(!!closedForm, false);
  });

  test('it shows a disabled button', async function(assert) {
    await render(hbs`{{bbl-lookup}}`);
    await click('.bbl-lookup-toggle'); // open it

    const disabledButton = await find('input.disabled');
    assert.equal(!!disabledButton, true);
  });

  skip('it shows an enabled button', async function(assert) {
    await this.set('boro', { code: 4 });
    await this.set('block', 12345)
    await render(hbs`{{bbl-lookup}}`);
    await click('.bbl-lookup-toggle'); // open it
    await triggerKeyEvent('.bbl-lookup--block-input', 'keyup', 53);

    const validButton = await find('input:not(.disabled)');
    assert.equal(!!validButton, true);
  });

});
