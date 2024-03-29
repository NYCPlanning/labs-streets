import Component from '@ember/component';
import { computed, action } from '@ember/object';
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
        const { altmappdf, effective, status } = properties;

        const pdf = altmappdf.split('/').pop();

        return {
          feature,
          status,
          timestamp: parseInt(moment(effective).format('X'), 10),
          pdflink: `https://nycdcp-dcm-alteration-maps.nyc3.digitaloceanspaces.com/${pdf}`,
          pdf,
          effective: moment(effective).format('MMM D, YYYY'),
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
        const { bbl, address } = properties;
        const BBLparts = splitBBL(bbl);

        return {
          feature,
          bbl,
          address,
          boro: BBLparts.boro,
          boroName: boroLookup[BBLparts.boro],
          block: BBLparts.block,
          lot: BBLparts.lot,
        };
      });

    return cleanLots;
  }

  @computed('features')
  get streetNameChanges() {
    const features = this.get('features');

    if (features === null) return features;

    // add a timestamp property to sort by
    const streetNameChanges = features
      .filter(d => d.properties.type === 'streetnamechange');

    streetNameChanges.forEach((d) => {
      d.properties.lleffectdt = moment(d.properties.lleffectdt, 'MM/DD/YYYY').format('MMM D, YYYY'); // eslint-disable-line
      return d;
    });

    return streetNameChanges;
  }

  @computed('features')
  get sectionMapLink() {
    const features = this.get('features');
    if (features === null) return features;

    const sectionMapLink = features
      .filter(d => d.properties.type === 'streetsect')
      .map((feature) => {
        const { properties } = feature;
        const { do_path, last_date, boro } = properties;

        return {
          feature,
          do_path,
          boro,
          boroname: boroLookup[boro],
          last_date: moment(last_date).format('MMM D, YYYY'),
          section_info: do_path === null ? null : do_path.split('.com/')[1],
        };
      });

    return sectionMapLink;
  }

  features = [];

  onHoverListItem = () => {};

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
