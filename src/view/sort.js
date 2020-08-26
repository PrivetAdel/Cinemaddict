import AbstractView from './abstract';
import {SortType} from '../const';

export default class Sort extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return (
      `<ul class="sort">
        <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
        <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
        <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
      </ul>`
    );
  }

  _changeActiveClass(target) {
    this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    target.classList.add(`sort__button--active`);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._changeActiveClass(evt.target);
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
