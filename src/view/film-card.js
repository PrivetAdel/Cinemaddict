import AbstractView from './abstract';

const MAX_SIMBOLS_COUNT = 140;

const generateDescriptionTemplate = (description) => {
  if (description.length > MAX_SIMBOLS_COUNT) {
    const shortDescription = description.slice(0, MAX_SIMBOLS_COUNT - 1);
    return `${shortDescription}...`;
  } else {
    return description;
  }
};

const generateReleaseDateTemplate = (releaseDate) => {
  return releaseDate.getFullYear();
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  _createFilmCardTemplate(film) {
    const {title, poster, description, comments, rating, runtime, releaseDate, genres, isFavorite, isWatched, isWatchlist} = film;

    const descriptionTemplate = generateDescriptionTemplate(description);
    const releaseDateTemplate = generateReleaseDateTemplate(releaseDate);

    const favoriteClassName = isFavorite ? `film-card__controls-item--active` : ``;
    const watchedClassName = isWatched ? `film-card__controls-item--active` : ``;
    const watchlistClassName = isWatchlist ? `film-card__controls-item--active` : ``;

    return (
      `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseDateTemplate}</span>
          <span class="film-card__duration">${runtime}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${descriptionTemplate}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}">Mark as favorite</button>
        </form>
      </article>`
    );
  }

  getTemplate() {
    return this._createFilmCardTemplate(this._film);
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  setAddtoWatchClickHandler(callback) {
    this._callback.addToWatchListClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._addToWatchListClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setFilmCardClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._clickHandler);
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._clickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._clickHandler);
  }
}
