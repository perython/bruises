import {ItemView} from 'backbone.marionette';
import template from './item-template.hbs';

export default ItemView.extend({
  className: 'top-artist',
  template: template,

  triggers: {
    click: 'info'
  },
  
  templateHelpers () {
    let images = this.model.get('images');
    let image = images.length ? images[0].url : '';
    return {
      image: image
    };
  }
});
