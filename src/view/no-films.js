import AbstractView from './abstract';

export default class NoFilms extends AbstractView {
  _createNoFilmsTemplate() {
    return (
      `<h2 class="films-list__title">There are no movies in our database</h2>`
    );
  }

  getTemplate() {
    return this._createNoFilmsTemplate();
  }
}
