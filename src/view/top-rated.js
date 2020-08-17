import {createElement} from '../utils';

export default class TopRated {
  constructor() {
    this._element = null;
  }

  _createTopRatedTemplate() {
    return (
      `<section class="films-list--extra">
        <h2 class="films-list__title">Top rated</h2>
        <div class="films-list__container">
        </div>
      </section>`
    );
  }

  getTemplate() {
    return this._createTopRatedTemplate();
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
