import Backbone from 'backbone';
import $ from 'jquery';
Backbone.$ = $;
import Marionette from 'backbone.marionette';
import 'tether';
import 'bootstrap';
import 'backbone.syphon';
import 'babel-polyfill';
import 'backbone-query-parameters';
import 'sortablejs';
import 'metismenu';

require('../assets/styles/app.less');

window.disableAjaxPrefilter = false;

$.ajaxPrefilter((options) => {
  if (window.localStorage.bruisesAccessToken) {
    let prefix = options.url.indexOf('?') > 0 ? '&' : '?';
    let data = {
      access_token: window.localStorage.bruisesAccessToken,
      refresh_token: window.localStorage.bruisesRefreshToken
    };
    options.url += `${prefix}${$.param(data)}`;
  }
  return options;
});

$.ajaxSetup({
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  contentType: 'application/json'
});

// start the marionette inspector
if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}
