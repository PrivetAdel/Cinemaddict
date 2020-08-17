import {createElement} from '../utils';

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  _createMenuTemplate(filters) {
    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
          <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filters.watchlist}</span></a>
          <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filters.history}</span></a>
          <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filters.favorites}</span></a>
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`
    );
  }

  getTemplate() {
    return this._createMenuTemplate(this._filters);
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
