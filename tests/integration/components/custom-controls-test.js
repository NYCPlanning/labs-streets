import { module, test, todo } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | custom-controls', function(hooks) {
  setupRenderingTest(hooks);

  // Flaky. Sometimes failing after PR #https://github.com/NYCPlanning/labs-streets/pull/334
  todo('share controls toggle open and closed', async function(assert) {
    await render(hbs`{{custom-controls shareURL='http://foo.bar/'}}`);

    // Opens
    await click('.share-controls .mapboxgl-ctrl-icon');
    const shareControlsContent = await find('.share-controls .custom-controls-content');
    assert.equal(!!shareControlsContent, true);

    // Closes
    await click('.share-controls .custom-controls-content .close-button');
    const shareControlsContent2 = await find('.share-controls .custom-controls-content');
    assert.equal(!!shareControlsContent2, false);
  });

  test('share controls renders the share URL', async function(assert) {
    await render(hbs`{{custom-controls shareURL='http://foo.bar/?foo=bar'}}`);
    await click('.share-controls .mapboxgl-ctrl-icon');
    const URL = await find('#share-url').value;
    assert.equal(URL, 'http://foo.bar/?foo=bar');
  });

  test('data controls toggle open and closed', async function(assert) {
    await render(hbs`{{custom-controls boundsGeoJSON=''}}`);

    // Opens
    await click('.data-controls .mapboxgl-ctrl-icon');
    const dataControlsContent = await find('.data-controls .custom-controls-content');
    assert.equal(!!dataControlsContent, true);

    // Closes
    await click('.data-controls .custom-controls-content .close-button');
    const dataControlsContent2 = await find('.data-controls .custom-controls-content');
    assert.equal(!!dataControlsContent2, false);
  });


});
