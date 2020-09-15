import AbstractView from './abstract';

export default class NoComments extends AbstractView {
  _createNoCommentsTemplate() {
    return (
      `<h2 class="films-list__title">Failed to load comments</h2>`
    );
  }

  getTemplate() {
    return this._createNoCommentsTemplate();
  }
}
