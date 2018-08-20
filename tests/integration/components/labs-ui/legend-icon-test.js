import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | legend-icon', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a line icon', async function(assert) {
    await render(hbs`{{labs-ui/legend-icon legendColor='#ff0000' legendIcon='line'}}`);
    const icon = await find('.fa-minus');
    assert.equal(!!icon, true);
  });

  test('it renders a polygon icon', async function(assert) {
    await render(hbs`{{labs-ui/legend-icon legendColor='#ff0000' legendIcon='polygon'}}`);
    const icon = await find('.fa-square');
    assert.equal(!!icon, true);
  });

  test('it renders a polygon-stacked icon', async function(assert) {
    await render(hbs`{{labs-ui/legend-icon legendColor='#ff0000' legendIcon='polygon-stacked'}}`);
    const icon = await find('.fa-square');
    assert.equal(!!icon, true);
  });

  test('it renders a polygon-line icon', async function(assert) {
    await render(hbs`{{labs-ui/legend-icon legendColor='#ff0000' legendIcon='polygon-line'}}`);
    const icon = await find('.fa-square-o');
    assert.equal(!!icon, true);
  });

  test('it renders a polygon-fill-dash icon', async function(assert) {
    await render(hbs`{{labs-ui/legend-icon legendColor='#ff0000' legendIcon='polygon-fill-dash'}}`);
    const fill = await find('.polygon-fill-dash .fill');
    assert.equal(!!fill, true);
    const dash = await find('.polygon-fill-dash .dash');
    assert.equal(!!dash, true);
  });

  test('it renders a point icon', async function(assert) {
    await render(hbs`{{labs-ui/legend-icon legendColor='#ff0000' legendIcon='point'}}`);
    const icon = await find('.fa-circle');
    assert.equal(!!icon, true);
  });

});
