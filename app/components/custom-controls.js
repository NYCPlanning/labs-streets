import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { run } from '@ember/runloop';

export default class CustomControls extends Component {
  // // Share Control properties
  shareURL;

  shareClosed = true;

  copySuccess = false;

  // // Data Control properties
  dataClosed = true;

  boundsGeoJSON;

  datasets = [
    { tableName: 'dcp_dcm', displayName: 'City Street Features', queryModifier: "feat_type NOT IN ('Pierhead_line', 'Bulkhead_line', 'Rail')" },
    { tableName: 'dcp_dcm_city_map_alterations', displayName: 'City Map Amendments' },
    { tableName: 'dcp_dcm_street_centerline', displayName: 'Street Centerlines' },
    { tableName: 'dcp_dcm_street_name_changes_points', displayName: 'Street Name Changes - Points' },
    { tableName: 'dcp_dcm_street_name_changes_lines', displayName: 'Street Name Changes - Streets' },
    { tableName: 'dcp_dcm_street_name_changes_areas', displayName: 'Street Name Changes - Areas' },
    { tableName: 'dcp_dcm', displayName: 'Pierhead and Bulkhead Lines', queryModifier: "feat_type IN ('Pierhead_line', 'Bulkhead_line')" },
    { tableName: 'dcp_dcm_arterials_major_streets', displayName: 'Arterials' },
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
