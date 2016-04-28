import _ from 'lodash';
import {history} from 'backbone';
import {ItemView} from 'backbone.marionette';
import template from './template.hbs';

export default ItemView.extend({
  template: template,
  tagName: 'aside',
  className: 'sidebar',

  attributes: {
    role: 'navigation'
  },

  collectionEvents: {
    change: 'render'
  },

  ui: {
    collapse: '#navbar-collapse',
    menu: '#sidebar-menu',
  },

  events: {
    'show.bs.collapse #navbar-collapse' : 'onCollapseShow'
  },

  templateHelpers() {
    return {
      items: this.collection.toJSON()
    };
  },

  onShow() {
    setTimeout(() => {
      this.ui.menu.metisMenu({
        activeClass: 'open'
      });
    }, 1000);
  },

  serializeWhere(props) {
    return _.invoke(this.collection.where(props), 'toJSON');
  },

  onCollapseShow() {
    this.listenToOnce(history, 'route', function() {
      this.ui.collapse.collapse('hide');
    });
  }
});
