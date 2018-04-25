import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { computed, action } from '@ember-decorators/object';
import { Action } from '@ember-decorators/argument/types';
import { type } from '@ember-decorators/argument/type';
import moment from 'moment';

function splitBBL(bbl) {
  const bblString = bbl.toString();
  const boro = bblString.substring(0, 1);
  const block = parseInt(bblString.substring(1, 6), 10);
  const lot = parseInt(bblString.substring(6), 10);

  return { boro, block, lot };
}

const boroLookup = {
  1: 'Manhattan',
  2: 'Bronx',
  3: 'Brooklyn',
  4: 'Queens',
  5: 'Staten Island',
};

export default class MapPopupContent extends Component {
  @computed('features')
  get cleanAlterations() {
    const features = this.get('features');
    if (features === null) return features;

    // add a timestamp property to sort by
    const cleanAlterations = features
      .filter(d => d.properties.type === 'alteration')
      .map((feature) => {
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

    return cleanAlterations.sort((a, b) => a.timestamp < b.timestamp);
  }

  @computed('features')
  get cleanLots() {
    const features = this.get('features');
    if (features === null) return features;

    // add a timestamp property to sort by
    const cleanLots = features
      .filter(d => d.properties.type === 'taxlot')
      .map((feature) => {
        const { properties } = feature;
        const BBLparts = splitBBL(properties.bbl);

        return {
          feature,
          bbl: properties.bbl,
          address: properties.address,
          boro: BBLparts.boro,
          boroName: boroLookup[BBLparts.boro],
          block: BBLparts.block,
          lot: BBLparts.lot,
        };
      });

    return cleanLots;
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
