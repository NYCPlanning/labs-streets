import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed, action } from '@ember-decorators/object';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import moment from 'moment';

export default class MapPopupContent extends Component {
  @computed('features')
  get cleanFeatures() {
    const features = this.get('features');
    if (features === null) return features;

    // add a timestamp property to sort by
    const cleanFeatures = features.map((feature) => {
      const { properties } = feature;

      const pdf = properties.altmappdf.split('/').pop();

      return {
        feature,
        timestamp: parseInt(moment(properties.effective).format('X'), 10),
        pdflink: `https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${pdf}`,
        pdf,
        effective: moment(properties.effective).format('MMM D, YYYY'),
      };
    });

    return cleanFeatures.sort((a, b) => a.timestamp < b.timestamp);
  }

  @argument
  features = [];

  @argument
  @type(Action)
  onHoverListItem = () => {};

  @argument
  @type(Action)
  onMouseLeave = () => {};

  @action
  handleHoverListItem(feature) {
    this.get('onHoverListItem')(feature);
  }

  @action
  mouseLeave() {
    this.get('onMouseLeave')();
  }
}
