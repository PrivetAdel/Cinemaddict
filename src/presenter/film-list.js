import FilmsListView from '../view/fimls-list';
import FilmCardView from '../view/film-card';
import FilmDetalisView from '../view/film-details-popup';
import ShowMoreButtonView from '../view/show-more-button';
import MostCommentedView from '../view/most-commented';
import TopRatedView from '../view/top-rated';
import NoFilmsView from '../view/no-films';
import {render, replace, remove} from '../utils/render';

const CARDS_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmList {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;
    this._renderFilmsCount = CARDS_COUNT_PER_STEP;

    this._filmsListComponent = new FilmsListView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._filmsListElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._topRatedFilmsListElement = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedFilmsListElement = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._filmsTopRated = [...this._films].sort((a, b) => b.rating - a.rating);
    this._filmsMostCommented = [...this._films].sort((a, b) => b.comments.length - a.comments.length);
    this._renderFilmsList();
  }

  _renderFilm(container, film) {
    const filmComponent = new FilmCardView(film);
    const filmDetalisComponent = new FilmDetalisView(film);

    const replaceCardToDetails = () => {
      replace(filmDetalisComponent, filmComponent);
    };

    const replaceDetailsToCard = () => {
      replace(filmComponent, filmDetalisComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceDetailsToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    filmComponent.setFilmCardClickHandler(() => {
      replaceCardToDetails();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    filmDetalisComponent.setCloseButtonClickHandler(() => {
      replaceDetailsToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(container, filmComponent);
  }

  _renderFilms(container, filmsList, from, to) {
    filmsList
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderNoFilms() {
    render(this._filmsListComponent, this._noFilmsComponent);
  }

  _showMoreButtonClickHandler() {
    this._renderFilms(this._filmsListElement, this._films, this._renderFilmsCount, this._renderFilmsCount + CARDS_COUNT_PER_STEP);
    this._renderFilmsCount += CARDS_COUNT_PER_STEP;

    if (this._renderFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setShowMoreButtonClickHandler(this._showMoreButtonClickHandler);
  }

  _renderFilmsList() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    } else {
      render(this._filmsListContainer, this._filmsListComponent);
      render(this._filmsListContainer, this._topRatedComponent);
      render(this._filmsListContainer, this._mostCommentedComponent);

      this._renderFilms(this._filmsListElement, this._films, 0, Math.min(this._films.length, CARDS_COUNT_PER_STEP));

      if (this._films.length > CARDS_COUNT_PER_STEP) {
        this._renderShowMoreButton();
      }

      this._renderFilms(this._topRatedFilmsListElement, this._filmsTopRated, 0, EXTRA_CARDS_COUNT);

      this._renderFilms(this._mostCommentedFilmsListElement, this._filmsMostCommented, 0, EXTRA_CARDS_COUNT);
    }
  }
}
