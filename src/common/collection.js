import {Collection} from 'backbone';

export default Collection.extend({
  initialize() {
    this.page = 1;
    this.more = true;
  },

  parse(response) {
    this.more = response.more;
    if (this.more) {
      this.page += 1;
    }
    this.trigger('total:update', response.total);
    return response.items;
  },

  loadMore(data = {}) {
    if (!this.more && !data.reset) {
      return;
    }

    if (data.reset) {
      this.page = 1;
    }

    let options = {
      data: Object.assign({}, {
        page: this.page
      }, data.filters || {})
    };

    if (data.reset) {
      options.reset = true;
    }

    this.fetch(options);
  }
});
