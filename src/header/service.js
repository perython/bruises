import {history} from 'backbone';
import Service from 'backbone.service';
import Model from './model';
import View from './view';
import utils from '../utils';

const HeaderService = Service.extend({
  setup(options = {}) {
    this.container = options.container;
    this.start();
  },

  start() {
    let model = new Model();
    model.fetch();
    this.view = new View({model: model});
    this.container.show(this.view);
  },

  requests: {
    login: 'login',
    logout: 'logout'
  },

  login(accessToken, refreshToken) {
    window.localStorage.setItem('bruisesAccessToken', accessToken);
    window.localStorage.setItem('bruisesRefreshToken', refreshToken);
    this.view.model.fetch();
  },

  logout() {
    window.localStorage.removeItem('bruisesAccessToken');
    window.localStorage.removeItem('bruisesRefreshToken');
    window.location.href = utils.rootUrl;
  }
});

export default new HeaderService();
