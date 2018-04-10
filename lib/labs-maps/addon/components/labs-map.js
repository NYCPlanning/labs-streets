import mapboxGlMap from 'ember-mapbox-gl/components/mapbox-gl';
import layout from '../templates/components/labs-map';

export default class MainMapComponent extends mapboxGlMap {
  layout = layout;
}
