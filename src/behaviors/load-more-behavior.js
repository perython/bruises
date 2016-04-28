import $ from 'jquery';
import {Behavior} from 'backbone.marionette';

export default Behavior.extend({
  initialize() {
    this.view.filters = {};
  },

  onShow() {
    let scrolling = false;
    $(window).bind('scroll', () => {
      if ($(window).height() + $(window).scrollTop() == $(document).height()) {
        scrolling = true;
        this.sendLoadMore();
        setTimeout(() => {
          scrolling = false;
        }, 1000);
      }
    });
  }
});
