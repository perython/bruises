import $ from 'jquery';
import {ItemView} from 'backbone.marionette';
import template from './template.hbs';

export default ItemView.extend({
  className: 'artist-modal',
  template: template,

  modelEvents: {
    sync: 'render'
  },

  triggers: {
    'click .btn-default': 'cancel',
    'click .close': 'cancel'
  },

  ui: {
    relatedArtists: '.related-artists',
    relatedArtist: '.related-artist'
  },

  events: {
    'click @ui.relatedArtist': 'changeArtist'
  },

  templateHelpers() {
    let images = this.model.get('images') || [];
    let imageUrl = images.length ? images[0].url : '';

    let albums = this.model.get('albums') || [];
    albums = albums.filter((a) => {return a.album_type === 'album';});

    let relatedArtists = this.model.get('related_artists') || [];
    relatedArtists = relatedArtists.map((a) => {
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
      imageUrl: imageUrl,
      albums: albums,
      relatedArtists: relatedArtists
    }
  },

  onRender() {
    let relatedArtists = this.model.get('related_artists') || [];
    if (relatedArtists) {
      this.ui.relatedArtists.css('width', 130 * relatedArtists.length);
    }
  },

  onShow() {
    this.$el.parents('.modal-dialog').attr('class', 'modal-dialog modal-lg');
  },

  changeArtist(e) {
    let id = $(e.currentTarget).data('id');
    this.model.set('id', id);
    this.model.fetch();
  }
});