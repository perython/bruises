import Syphon from 'backbone.syphon';
import {CompositeView} from 'backbone.marionette';
import LoadMoreBehavior from '../../../behaviors/load-more-behavior';
import ItemView from './item-view.js';
import template from './composite-template.hbs';

export default CompositeView.extend({
  tagName: 'article',
  className: 'content top-tracks',
  template: template,
  childViewContainer: '.top-tracks-list',
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

  sendLoadMore(remove) {
    var data = {
      filters: this.filters,
      remove: remove
    };
    this.collection.loadMore(data);
  },

  updateTotals(total) {
    this.ui.totalItems.text(total);
  }
})
