import AbstractView from './abstract';

export default class Films extends AbstractView {
  _createFilmsTemplate() {
    return (
      `<section class="films"></section>`
    );
  }

  getTemplate() {
    return this._createFilmsTemplate();
  }
}
