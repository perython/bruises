import $ from 'jquery';
import {ItemView} from 'backbone.marionette';
import ModalService from '../modal/service';
import ProfileModalView from '../modal/profile/view'
import HeaderService from './service';
import template from './template.hbs';

export default ItemView.extend({
  template: template,
  tagName: 'header',
  className: 'header',

  modelEvents: {
    sync: 'render'
  },

  ui: {
    sidebarCollapseBtn: '#sidebar-collapse-btn',
    profileInfo: '.profile-info',
    logout: '.logout'
  },

  events: {
    'click @ui.sidebarCollapseBtn': 'toggleSidebar',
    'click @ui.profileInfo': 'profile',
    'click @ui.logout': 'logout'
  },

  templateHelpers() {
    let images = this.model.get('images') || [];
    let imageUrl = images.length ? images[0].url : 'https://placekitten.com/50/50';
    return {
      imageUrl: imageUrl
    }
  },

  toggleSidebar(e) {
    e.preventDefault();
    $('#app').toggleClass('sidebar-open');
    $('.sidebar-overlay').one('click', () => {
      $('#app').removeClass('sidebar-open');
    });
  },

  profile(e) {
    e.preventDefault();
    let view = new ProfileModalView({model: this.model});
    this.listenToOnce(view, 'cancel', () => {
      ModalService.request('close', view);
    });
    ModalService.request('open', view);
  },

  logout(e) {
    e.preventDefault();
    HeaderService.request('logout');
  }
});
