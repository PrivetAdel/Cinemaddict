import AbstractView from './abstract';

export default class TopRated extends AbstractView {
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
}
