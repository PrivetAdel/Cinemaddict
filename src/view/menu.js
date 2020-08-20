import AbstractView from './abstract';

export default class Menu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
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
}
