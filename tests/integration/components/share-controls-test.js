import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | share-controls', function(hooks) {
  setupRenderingTest(hooks);

  test('it toggles open and closed', async function(assert) {
    await render(hbs`{{share-controls shareURL='http://foo.bar/'}}`);

    // Opens
    await click('.share-controls-toggle');
    const shareControlsContent = await find('.share-controls-content');
    assert.equal(!!shareControlsContent, true);

    // Closes
    await click('.share-controls-content .close-button');
    const shareControlsContent2 = await find('.share-controls-content');
    assert.equal(!!shareControlsContent2, false);
  });

  test('it renders the URL', async function(assert) {
    await render(hbs`{{share-controls shareURL='http://foo.bar/?foo=bar'}}`);
    await click('.share-controls-toggle');
    const URL = await find('#share-url').value;
    assert.equal(URL, 'http://foo.bar/?foo=bar');
  });

});
