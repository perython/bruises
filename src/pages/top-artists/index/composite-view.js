import Syphon from 'backbone.syphon';
import {CompositeView} from 'backbone.marionette';
import LoadMoreBehavior from '../../../behaviors/load-more-behavior';
import ModalService from '../../../modal/service';
import ArtistInfoModel from '../../../modal/top-artist/model';
import ArtistInfoView from '../../../modal/top-artist/view';
import ItemView from './item-view.js';
import template from './composite-template.hbs';

export default CompositeView.extend({
  tagName: 'article',
  className: 'content top-artists',
  template: template,
  childViewContainer: '.top-artists-list',
  childView: ItemView,

  behaviors: {
    loadMore: {
      behaviorClass: LoadMoreBehavior
    }
  },

  ui: {
    form: '.filters-form',
    totalItems: '.total-items'
  },

  childEvents: {
    info: 'info'
  },

  events: {
    'submit @ui.form': 'submit',
    'change .filters-form input': 'changeFilters'
  },

  submit(e) {
    e.preventDefault();
  },

  changeFilters() {
    Object.assign(this.filters, Syphon.serialize(this));
    this.sendLoadMore(true);
  },

  sendLoadMore(reset = false) {
    var data = {
      filters: this.filters,
      reset: reset
    };
    this.collection.loadMore(data);
  },

  updateTotals(total) {
    this.ui.totalItems.text(total);
  },

  info(itemView) {
    let model = new ArtistInfoModel({id: itemView.model.get('id')});
    model.fetch();
    let view = new ArtistInfoView({model: model});
    this.listenToOnce(view, 'cancel', () => {
      ModalService.request('close', view);
    });
    ModalService.request('open', view);
  }
})
