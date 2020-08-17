import {createElement} from '../utils';

export default class MoviesCount {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  _createMoviesCountTemplate(count) {
    return (
      `<p>${count} movies inside</p>`
    );
  }

  getTemplate() {
    return this._createMoviesCountTemplate(this._count);
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
