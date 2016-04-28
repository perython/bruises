import {ItemView} from 'backbone.marionette';
import ModalService from '../../../modal/service';
import ArtistInfoModel from '../../../modal/top-artist/model';
import ArtistInfoView from '../../../modal/top-artist/view';
import template from './item-template.hbs';

export default ItemView.extend({
  tagName: 'tr',
  template: template,

  ui: {
    info: '.info'
  },

  events: {
    'click @ui.info': 'info'
  },

  templateHelpers () {
    let index = this.model.collection.indexOf(this.model) + 1;

    let track = this.model.get('track');
    let durationMs = track.duration_ms;
    let duration;
    if (durationMs) {
      let minutes = durationMs / 60000 << 0;
      let seconds = (durationMs / 1000 << 0) % 60;
      let prefixSeconds = seconds < 10 ? '0' : '';
      duration = `${minutes}:${prefixSeconds}${seconds}`;
    }
    return Object.assign({}, this.model.get('track'), {
      index: index,
      duration: duration
    });
  },

  info(e) {
    e.preventDefault();

    let id = $(e.currentTarget).data('id');
    let model = new ArtistInfoModel({id: id});
    model.fetch();
    let view = new ArtistInfoView({model: model});
    this.listenToOnce(view, 'cancel', () => {
      ModalService.request('close', view);
    });
    ModalService.request('open', view);
  }
});
