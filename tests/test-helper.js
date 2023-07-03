import Application from '../app';
import config from '../config/environment';
import { setApplication, createMap } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
