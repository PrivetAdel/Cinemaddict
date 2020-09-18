import AbstractView from './abstract';
import {PageMode} from '../const';

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType, pageMode) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._pageMode = pageMode;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);
  }

  _createFilterTemplate(filter) {
    const {type, name, count} = filter;

    return (
      `<a href="#${type}" id=${type} class="main-navigation__item ${this._currentFilterType === type ? `main-navigation__item--active` : ``}">${name} ${name !== `All movies` ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
    );
  }

  _createMenuTemplate(filters) {
    const filtersTemplate = filters.map((filter) => this._createFilterTemplate(filter)).join(``);

    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersTemplate}
        </div>
        <a href="#stats" class="main-navigation__additional ${this._pageMode === PageMode.STATISTICS ? `main-navigation__additional--active` : ``}">Stats</a>
      </nav>`
    );
  }

  getTemplate() {
    return this._createMenuTemplate(this._filters);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.id);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _statisticsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statisticsClick();
  }

  setStatisticsClickHandler(callback) {
    this._callback.statisticsClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statisticsClickHandler);
  }
}
