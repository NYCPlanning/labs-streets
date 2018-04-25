import Component from '@ember/component';
import { inject as service } from '@ember/service';
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

  @argument
  boro = '';

  @argument
  block = '';

  @argument
  lot = '';

  @argument
  mainMap = service();

  @argument
  metrics = service();

  @argument
  focused = false;

  @argument
  errorMessage = '';

  @argument
  closed = true;

  @action
  checkBBL() {
    const { boro: { code }, block, lot } = this.getProperties('boro', 'block', 'lot');

    const uniqueSQL = `select bbl from mappluto_v1711 where block= ${block} and lot = ${lot} and borocode = ${code}`;
    carto.SQL(uniqueSQL).then((response) => {
      if (response[0]) {
        this.set('errorMessage', '');
        this.setProperties({
          selected: 0,
          focused: false,
          closed: true,
        });

        this.transitionTo('lot', code, block, lot);
      } else {
        this.set('errorMessage', 'The BBL does not exist.');
      }
    });
  }

  @action
  setBorocode(option) {
    this.set('boro', option);
  }
}
