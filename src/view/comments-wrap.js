import AbstractView from './abstract';

export default class CommentsWrap extends AbstractView {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  _createFilmsTemplate() {
    return (
      `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
        <ul class="film-details__comments-list"></ul>
      </section>`
    );
  }

  getTemplate() {
    return this._createFilmsTemplate();
  }
}
