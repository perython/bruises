import $ from 'jquery';
import {Application} from 'backbone.marionette';
import HandlebarsHelper from '../helpers/handlebar-helper';
import LayoutView from './layout-view';

export default Application.extend({
  initialize() {
    new HandlebarsHelper().initialize();
    this.$body = $(document.body);
    this.layout = new LayoutView();
    this.layout.render();
  }
});
