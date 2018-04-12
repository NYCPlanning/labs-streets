import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import mapboxgl from 'mapbox-gl';
import { run } from '@ember/runloop';
import createMap from '../../helpers/create-map';

module('Integration | Component | labs-layers', {
    async beforeEach() {
      this.map = await createMap();
      this.layer = null;
    },
    afterAfter() {
      this.map.remove();
      this.layer = null;
    }
  }, function(hooks) {
  setupRenderingTest(hooks);

  test('changes to model filter mutate mapbox state', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    let store = this.owner.lookup('service:store');
    await this.map.addSource('filter-test',{
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            -76.53063297271729,
            39.18174077994108
          ]
        }
      }
    });
    this.layer = await run(() =>
      store.createRecord('layer', {
        style: {
          id: 'rveilqbyveqpivhbeq',
          type: 'circle',
          filter: [ '==', '$type', 'Point' ],
          source: 'filter-test',
        }
      }
    ));

    this.set('map', this.map);
    this.set('model', {
      sources: [],
      layers: [this.layer]
    });
    await render(hbs`{{labs-layers model=model map=map}}`);

    assert.deepEqual(
      this.map.getFilter(this.layer.get('style.id')),
      this.layer.get('filter'), 
      'filter was set',
    );

    this.layer.set('filter', [ '!=', '$type', 'LineString' ]);

    assert.deepEqual(
      this.map.getFilter(this.layer.get('style.id')),
      this.layer.get('filter'), 
      'filter was set',
    );

    assert.deepEqual(
      this.map.getFilter(this.layer.get('style.id')),
      [ '!=', '$type', 'LineString' ], 
      'filter was set',
    );
  });

  test('changes to model paint mutate mapbox state', async function(assert) {
    let store = this.owner.lookup('service:store');
    await this.map.addSource('filter-test',{
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            -76.53063297271729,
            39.18174077994108
          ]
        }
      }
    });

    this.layer = await run(() =>
      store.createRecord('layer', {
        style: {
          id: 'u3qfgoljknjklm',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [
                  -76.53063297271729,
                  39.18174077994108
                ]
              }
            }
          },
          paint: {
            'circle-color': 'white'
          },
        }
      }
    ));

    this.set('map', this.map);
    this.set('model', {
      sources: [],
      layers: [this.layer]
    });

    await render(hbs`{{labs-layers model=model map=map}}`);

    assert.equal(
      this.map.getPaintProperty(this.layer.get('style.id'), 'circle-color'), 
      'white', 
      'paint property was set',
    );

    this.layer.set('paint', { 'circle-color': 'black' });

    // TODO: this should not be here but there's some race conditions for some reason... 
    await waitUntil(() => {
      return this.map.getLayer(this.layer.get('style.id')).getPaintProperty('circle-color') === 'black'
    });

    assert.equal(
      this.map.getLayer(this.layer.get('style.id')).getPaintProperty('circle-color'),
      'black',
      'paint property was updated',
    );
  });
});
