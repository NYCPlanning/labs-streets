import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | map-popup-content', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a spinner', async function(assert) {
    this.set('popupFeatures', null); // popup features is set to null prior to API call
    await render(hbs`{{map-popup-content features=popupFeatures }}`);
    const spinner = await find('.fa-spin');
    assert.equal(!!spinner, true);
  });

  test('it renders a no-ammendments message', async function(assert) {
    this.set('popupFeatures', []);
    await render(hbs`{{map-popup-content features=popupFeatures }}`);
    assert.equal(this.element.textContent.trim(), 'There are no map amendments here.');
  });

  test('it renders ammendments', async function(assert) {
    this.set('popupFeatures', [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[[-73, 40],[-73, 41],[-74, 41],[-74, 40]]]
        },
        'properties': {
          'name': 'Party',
          'altmappdf': 'like-its.pdf',
          'effective': '1999-01-01T05:00:00Z'
        }
      }
    ]);

    await render(hbs`{{map-popup-content features=popupFeatures }}`);

    const header = await find('.popup-header');
    assert.equal(header.textContent.trim(), 'Map Amendments');

    const altmappdf = await find('.popup-list a');
    assert.equal(altmappdf.textContent.trim(), 'like-its.pdf');

    const effective = await find('.popup-list .date');
    assert.equal(effective.textContent.trim(), 'Jan 1, 1999');
  });

});
