import {ItemView} from 'backbone.marionette';
import utils from '../../../utils';
import HeaderService from '../../../header/service';
import template from './template.hbs';

export default ItemView.extend({
  tagName: 'section',
  className: 'content',
  template: template,

  initialize() {
    let args = utils.getQueryParams(document.location.search);
    if (args.access_token) {
      HeaderService.request('login', args.access_token, args.refresh_token);
    }
  }
});
