import SmartView from './smart';
import {getReleaseDate} from '../utils/common';

const createGenresTemplate = (genres) => {
  return `<td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
  <td class="film-details__cell">
    ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``)}
  </td>`;
};

export default class FilmDetalis extends SmartView {
  constructor(film) {
    super();
    this._data = FilmDetalis.parseFilmToData(film);

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._changeControlHandler = this._changeControlHandler.bind(this);

    this._setInnerHandlers();
  }

  _createFilmDetalisPopupTemplate(film) {
    const {title, description, comments, poster, rating, runtime, releaseDate, genres, director, writers, actors, country, isWatchlist, isWatched, isFavorite} = film;

    const releaseDateTemplate = getReleaseDate(releaseDate, true);
    const genresTemplate = createGenresTemplate(genres);

    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

                <p class="film-details__age">18+</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${title}</h3>
                    <p class="film-details__title-original">Original: ${title}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${writers}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actors}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${releaseDateTemplate}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${runtime}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${country}</td>
                  </tr>
                  <tr class="film-details__row">
                    ${genresTemplate}
                  </tr>
                </table>

                <p class="film-details__film-description">
                  ${description}
                </p>
              </div>
            </div>
            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>

          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
              <ul class="film-details__comments-list"></ul>
            </section>
          </div>
        </form>
      </section>`
    );
  }

  getTemplate() {
    return this._createFilmDetalisPopupTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick(FilmDetalis.parseDataToFilm(this._data));
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  reset(film) {
    this.updateData(
        FilmDetalis.parseFilmToData(film)
    );
  }

  _changeControlHandler(evt) {
    if (evt.target.classList.contains(`film-details__control-input`)) {
      evt.preventDefault();

      let update;
      switch (evt.target.id) {
        case `watchlist`:
          update = {isWatchlist: !this._data.isWatchlist};
          break;
        case `watched`:
          update = {isWatched: !this._data.isWatched};
          break;
        case `favorite`:
          update = {isFavorite: !this._data.isFavorite};
          break;
      }
      this.updateData(update, true);
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, this._changeControlHandler);
  }

  static parseFilmToData(film) {
    return Object.assign({}, film);
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    return data;
  }
}
