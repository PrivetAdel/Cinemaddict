import {createElement} from '../utils';

export default class NoFilms {
  constructor() {
    this._element = null;
  }

  _createNoFilmsTemplate() {
    return (
      `<h2 class="films-list__title">There are no movies in our database</h2>`
    );
  }

  getTemplate() {
    return this._createNoFilmsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
