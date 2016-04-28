import {LayoutView} from 'backbone.marionette';
import ContentRegion from './content-region';
import template from './layout-template.hbs';

export default LayoutView.extend({
  el: '#app',
  template: template,

  regions: {
    sidebar: '.application__sidebar',
    header: '.application__header',
    flashes: '.application__flashes',
    content: {
      selector: '.application__content',
      regionClass: ContentRegion
    },
    overlay: '.application__overlay'
  }
});
