import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:mapbox-gl-layer', 'Unit | Transform | mapbox gl layer', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:mapbox-gl-layer');
    assert.ok(transform);
  });

  test('it sets missing paint prop', function(assert) {
    let transform = this.owner.lookup('transform:mapbox-gl-layer');
    const transformed = transform.deserialize({
      "id": "citymap-street-treatments-line",
      "style": {
        "id": "citymap-street-treatments-line",
        "type": "line",
        "source": "digital-citymap",
        "source-layer": "citymap",
        "filter": [
          "all",
          [
            "==",
            "type",
            "street_treatment"
          ]
        ]
      }
    });

    assert.ok(transformed.paint);
  });

  test('it sets missing layout prop', function(assert) {
    let transform = this.owner.lookup('transform:mapbox-gl-layer');
    const transformed = transform.deserialize({
      "id": "citymap-street-treatments-line",
      "style": {
        "id": "citymap-street-treatments-line",
        "type": "line",
        "source": "digital-citymap",
        "source-layer": "citymap",
        "filter": [
          "all",
          [
            "==",
            "type",
            "street_treatment"
          ]
        ]
      }
    });

    assert.ok(transformed.layout);
  });

  test('it sets missing filter prop', function(assert) {
    let transform = this.owner.lookup('transform:mapbox-gl-layer');
    const transformed = transform.deserialize({
      "id": "citymap-street-treatments-line",
      "style": {
        "id": "citymap-street-treatments-line",
        "type": "line",
        "source": "digital-citymap",
        "source-layer": "citymap",
      }
    });

    assert.ok(transformed.filter);
  });
});
