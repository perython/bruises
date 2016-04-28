import {ItemView} from 'backbone.marionette';
import ModalService from '../../modal/service';
import ArtistInfoModel from '../../modal/top-artist/model';
import ArtistInfoView from '../../modal/top-artist/view';
import template from './template.hbs';

export default ItemView.extend({
  className: 'profile-modal',
  template: template,

  triggers: {
    'click .btn-default': 'cancel',
    'click .close': 'cancel'
  },

  ui: {
    followedArtists: '.followed-artists',
    followedArtist: '.followed-artist'
  },

  events: {
    'click @ui.followedArtist': 'infoArtist'
  },

  templateHelpers() {
    let followedArtists = this.model.get('followed_artists') || [];
    followedArtists = followedArtists.map((a) => {
      let url = '';
      let urls = a.images.filter((i) => {return i.width === 200});
      if (urls.length) {
        url = urls[0].url;
      } else if (a.images.length) {
        url = a.images[0].url;
      }
      return {
        id: a.id,
        name: a.name,
        url: url
      };
    });

    return {
      followedArtists: followedArtists
    }
  },

  onRender() {
    let followedArtists = this.model.get('followed_artists') || [];
    if (followedArtists) {
      this.ui.followedArtists.css('width', 130 * followedArtists.length);
    }
  },

  onShow() {
    this.$el.parents('.modal-dialog').attr('class', 'modal-dialog');
  },

  infoArtist(e) {
    let id = $(e.currentTarget).data('id');
    let model = new ArtistInfoModel({id: id});
    ModalService.request('close', this);
    model.fetch().then(() => {
      let view = new ArtistInfoView({model: model});
      this.listenToOnce(view, 'cancel', () => {
        ModalService.request('close', view);
      });
      ModalService.request('open', view);
    });
  }
});
