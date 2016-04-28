import $ from 'jquery';
import ModalService from 'backbone-service-modals';
import LayoutView from './layout-view';
import AlertView   from './alert/view';
import ConfirmView from './confirm/view';
import PromptView  from './prompt/view';

const CustomModalService = ModalService.extend({
  AlertView: AlertView,
  ConfirmView: ConfirmView,
  PromptView: PromptView,

  setup(options = {}) {
    this.container = options.container;
  },

  start() {
    this.layout = new LayoutView();
    this.container.show(this.layout);
  },

  render(view) {
    this.layout.content.show(view);
    $(document).keyup((e) => {
      if (e.keyCode === 27) {
        view.trigger('cancel');
      }
    });
  },

  remove() {
    this.layout.content.reset();
    $(document).unbind('keyup');
  },

  animateIn() {
    return this.layout.animateIn();
  },

  animateOut() {
    return this.layout.animateOut();
  }
});

export default new CustomModalService();
