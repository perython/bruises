import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';
import template from './template.hbs';

export default ItemView.extend({
  template: template,

  initialize() {
    this.model = new Model(this.options);
  },

  triggers: {
    'click .btn-primary': 'confirm',
    'click .close': 'cancel'
  }
});
