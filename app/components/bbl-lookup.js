import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { action } from '@ember-decorators/object';
import carto from '../utils/carto';

export default class BBLLookupComponent extends Component {
  classNames=['bbl-lookup hide-for-print'];

  boroOptions=[
    { name: 'Manhattan (1)', code: '1' },
    { name: 'Bronx (2)', code: '2' },
    { name: 'Brooklyn (3)', code: '3' },
    { name: 'Queens (4)', code: '4' },
    { name: 'Staten Island (5)', code: '5' },
  ];

  validBlock = false;
  validLot = false;

  @argument
  boro = '';

  @argument
  block = '';

  @argument
  lot = '';

  @argument
  errorMessage = '';

  @argument
  closed = true;

  @argument
  flyTo;

  @action
  validate() {
    const boro = this.get('boro');
    const block = this.get('block');
    const lot = this.get('lot');

    const validBoro = (boro !== '');
    const validBlock = ((block !== '') && (parseInt(block, 10) < 100000) && (parseInt(block, 10) > 0));
    const validLot = ((lot !== '') && (parseInt(lot, 10) < 10000) && (parseInt(lot, 10) > 0));

    this.set('validBlock', validBoro && validBlock);
    this.set('validLot', validBoro && validBlock && validLot);
  }

  @action
  checkLot() {
    const { boro: { code }, block, lot } = this.getProperties('boro', 'block', 'lot');

    const SQL = `SELECT st_centroid(the_geom) as the_geom FROM mappluto_v1711 WHERE block= ${parseInt(block, 10)} AND lot = ${parseInt(lot, 10)} AND borocode = ${code}`;
    carto.SQL(SQL, 'geojson').then((response) => {
      if (response.features[0]) {
        this.set('errorMessage', '');
        this.setProperties({
          closed: true,
        });
        this.flyTo(response.features[0].geometry.coordinates, 18);
      } else {
        this.set('errorMessage', 'The Lot does not exist.');
      }
    });
  }

  @action
  checkBlock() {
    const { boro: { code }, block } = this.getProperties('boro', 'block');

    const SQL = `SELECT the_geom FROM mappluto_block_centroids WHERE block= ${parseInt(block, 10)} AND borocode = ${code}`;
    carto.SQL(SQL, 'geojson').then((response) => {
      if (response.features[0]) {
        this.set('errorMessage', '');
        this.setProperties({
          closed: true,
        });
        this.flyTo(response.features[0].geometry.coordinates, 16);
      } else {
        this.set('errorMessage', 'The Block does not exist.');
      }
    });
  }

  @action
  setBorocode(option) {
    this.set('boro', option);
    this.send('validate');
  }
}
