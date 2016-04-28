import {Route} from 'backbone-routing';
import Collection from '../collection';
import CompositeView from './composite-view';

export default Route.extend({
  initialize(options) {
    this.container = options.container;
  },

  render() {
    let collection = new Collection();
    collection.loadMore();

    this.compositeView = new CompositeView({
      collection: collection
    });
    this.container.show(this.compositeView);

    this.listenTo(collection, 'total:update', function(data) {
      this.compositeView.updateTotals(data);
    });

    this.listenTo(this.compositeView, 'loadMore', function (data) {
      collection.loadMore(data);
    });
  }
});
