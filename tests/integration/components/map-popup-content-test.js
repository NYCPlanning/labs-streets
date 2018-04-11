import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import mapboxgl from 'mapbox-gl';

const map = new mapboxgl.Map({container: document.createElement('div')});

module('Integration | Component | map-popup-content', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a spinner', async function(assert) {
    this.set('popupFeatures', null); // popup features is set to null prior to API call
    this.set('map', map);
    this.set('popupLocation', {lat:0, lng: 0});

    await render(hbs`
      {{map-popup-content
        map=map
        features=popupFeatures
        location=popupLocation
      }}
      `);

    const spinner = await find('.fa-spin');
    assert.equal(!!spinner, true);
  });

  test('it renders a no-ammendments message', async function(assert) {
    this.set('popupFeatures', []);
    this.set('map', map);
    this.set('popupLocation', {lat:0, lng: 0});

    await render(hbs`
      {{map-popup-content
        map=map
        features=popupFeatures
        location=popupLocation
      }}
      `);
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
    this.set('map', map);
    this.set('popupLocation', {lat:-73.5, lng: 40.5});

    await render(hbs`
      {{map-popup-content
        map=map
        features=popupFeatures
        location=popupLocation
      }}
      `);

    const header = await find('.popup-header');
    assert.equal(header.textContent.trim(), 'Map Amendments');

    const altmappdf = await find('.popup-list a');
    assert.equal(altmappdf.textContent.trim(), 'like-its.pdf');

    const effective = await find('.popup-list .date');
    assert.equal(effective.textContent.trim(), 'Jan 1, 1999');
  });

});
