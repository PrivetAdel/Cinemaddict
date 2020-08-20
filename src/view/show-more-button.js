import AbstractView from './abstract';

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
  }

  _createShowMoreButtonTemplate() {
    return (
      `<button class="films-list__show-more">Show more</button>`
    );
  }

  getTemplate() {
    return this._createShowMoreButtonTemplate();
  }

  _showMoreButtonClickHandler() {
    this._callback.click();
  }

  setShowMoreButtonClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._showMoreButtonClickHandler);
  }
}
