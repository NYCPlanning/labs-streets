import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action, computed } from '@ember-decorators/object';
import { run } from '@ember/runloop';

export default class ShareControls extends Component {
  // Share Control properties
  @argument shareURL;
  @argument shareClosed = true;
  @argument copySuccess = false;

  // Data Control properties
  @argument dataClosed = true;
  @argument boundsGeoJSON;

  datasets = [
    { tableName: 'citymap_citymap_v0', displayName: 'City Street Features' },
    { tableName: 'citymap_amendments_v0', displayName: 'City Map Amendments' },
    { tableName: 'citymap_streetcenterlines_v0', displayName: 'Street Centerlines' },
    { tableName: 'citymap_streetnamechanges_points_v0', displayName: 'Street Name Changes - Points' },
    { tableName: 'citymap_streetnamechanges_streets_v0', displayName: 'Street Name Changes - Streets' },
    { tableName: 'citymap_streetnamechanges_areas_v0', displayName: 'Street Name Changes - Areas' },
    { tableName: 'citymap_pierheadlines_v0', displayName: 'Pierhead and Bulkhead Lines' },
    { tableName: 'citymap_arterials_v0', displayName: 'Arterials' },
  ]

  @computed('boundsGeoJSON')
  get stringifiedBoundsGeoJSON() {
    const stringified = JSON.stringify(this.get('boundsGeoJSON'));
    const escaped = stringified.replace('"', '\"'); // eslint-disable-line
    return escaped;
  }

  @action
  handleShareOpen() {
    this.send('handleClose');
    this.set('shareClosed', false);
  }

  @action
  handleDataOpen() {
    this.send('handleClose');
    this.set('dataClosed', false);
  }

  @action
  handleClose() {
    this.set('shareClosed', true);
    this.set('dataClosed', true);
    this.set('copySuccess', false);
  }

  @action
  handleShareSuccess() {
    this.set('copySuccess', true);
    run.later(() => {
      this.set('copySuccess', false);
    }, 2000);
  }
}
