import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { run } from '@ember/runloop';

export default class ShareControls extends Component {
  @argument shareURL;
  @argument closed = true;
  @argument copySuccess = false;

  @action
  handleShareOpen() {
    this.set('closed', false);
  }

  @action
  handleShareClose() {
    this.set('closed', true);
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
