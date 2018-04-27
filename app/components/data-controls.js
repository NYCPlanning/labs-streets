import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action, computed } from '@ember-decorators/object';

export default class ShareControls extends Component {
  closed = true;

  datasets = [
    {
      tableName: 'citymap_citymap_v0',
      displayName: 'City Map Features',
    },
    {
      tableName: 'citymap_amendments_v0',
      displayName: 'City Map Amendments',
    },
    {
      tableName: 'citymap_streetcenterlines_v0',
      displayName: 'Street Centerlines',
    },
    {
      tableName: 'citymap_streetnamechanges_points_v0',
      displayName: 'Street Name Changes - Points',
    },
    {
      tableName: 'citymap_streetnamechanges_streets_v0',
      displayName: 'Street Name Changes - Streets',
    },
    {
      tableName: 'citymap_streetnamechanges_areas_v0',
      displayName: 'Street Name Changes - Areas',
    },
    {
      tableName: 'citymap_pierheadlines_v0',
      displayName: 'Pierhead and Bulkhead Lines',
    },
    {
      tableName: 'citymap_arterials_v0',
      displayName: 'Arterials',
    },
  ]

  @argument
  boundsGeoJSON

  @computed('boundsGeoJSON')
  get stringifiedBoundsGeoJSON() {
    const stringified = JSON.stringify(this.get('boundsGeoJSON'));
    const escaped = stringified.replace('"', '\"'); // eslint-disable-line
    return escaped;
  }

  @action
  handleOpen() {
    this.set('closed', false);
  }

  @action
  handleClose() {
    this.set('closed', true);
  }
}
