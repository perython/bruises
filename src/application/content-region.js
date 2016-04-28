import $ from 'jquery';
import {Region} from 'backbone.marionette';

export default Region.extend({
  onBeforeShow() {
    $(window).unbind('scroll');
  }
});
