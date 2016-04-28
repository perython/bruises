import {Router} from 'backbone-routing';
import SidebarService from '../../sidebar/service';
import IndexRoute from './index/route';

export default Router.extend({
  initialize(options) {
    this.container = options.container;
    this.listenTo(this, 'before:enter', this.onBeforeEnter);

    SidebarService.request('add', {
      name: 'Saved Tracks',
      path: 'saved-tracks',
      iconClass: 'fa-circle'
    });
  },

  onBeforeEnter() {
    SidebarService.request('activate', { path: 'saved-tracks' });
  },

  routes: {
    'saved-tracks': 'index'
  },

  index() {
    return new IndexRoute({
      container: this.container
    });
  }
});
