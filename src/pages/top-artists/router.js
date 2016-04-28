import {Router} from 'backbone-routing';
import SidebarService from '../../sidebar/service';
import IndexRoute from './index/route';

export default Router.extend({
  initialize(options) {
    this.container = options.container;
    this.listenTo(this, 'before:enter', this.onBeforeEnter);

    SidebarService.request('add', {
      name: 'Top Artists',
      path: 'top-artists',
      iconClass: 'fa-circle'
    });
  },

  onBeforeEnter() {
    SidebarService.request('activate', { path: 'top-artists' });
  },

  routes: {
    'top-artists': 'index'
  },

  index() {
    return new IndexRoute({
      container: this.container
    });
  }
});
