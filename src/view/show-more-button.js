import {createElement} from '../utils';

export default class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  _createShowMoreButtonTemplate() {
    return (
      `<button class="films-list__show-more">Show more</button>`
    );
  }

  getTemplate() {
    return this._createShowMoreButtonTemplate();
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
