import FilmsListView from '../view/fimls-list';
import FilmCardView from '../view/film-card';
import FilmDetalisView from '../view/film-details-popup';
import ShowMoreButtonView from '../view/show-more-button';
import MostCommentedView from '../view/most-commented';
import TopRatedView from '../view/top-rated';
import SortView from '../view/sort';
import NoFilmsView from '../view/no-films';
import {render, replace, remove} from '../utils/render';
import {sortFilmDate, sortFilmRating} from '../utils/common';
import {SortType} from '../const';

const CARDS_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmList {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;
    this._renderFilmsCount = CARDS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._filmsListComponent = new FilmsListView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._filmsListElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._topRatedFilmsListElement = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedFilmsListElement = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._sortComponent = new SortView();

    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
  }

  init(films) {
    this._films = [...films];
    this._sourcedFilms = [...films];
    this._filmsTopRated = [...this._films].sort((a, b) => b.rating - a.rating);
    this._filmsMostCommented = [...this._films].sort((a, b) => b.comments.length - a.comments.length);

    render(this._filmsListContainer, this._filmsListComponent);
    render(this._filmsListContainer, this._topRatedComponent);
    render(this._filmsListContainer, this._mostCommentedComponent);

    this._renderFilmsList();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmDate);
        break;
      case SortType.RATING:
        this._films.sort(sortFilmRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handlerSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderAllFilms();
  }

  _renderSort() {
    render(this._filmsListContainer, this._sortComponent, `before`);
    this._sortComponent.setSortTypeChangeHandler(this._handlerSortTypeChange);
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

  _renderFilms(container, films, from, to) {
    films
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

  _clearFilmList() {
    this._filmsListElement.innerHTML = ``;
    this._renderFilmsCount = CARDS_COUNT_PER_STEP;
  }

  _renderAllFilms() {
    this._renderFilms(this._filmsListElement, this._films, 0, Math.min(this._films.length, CARDS_COUNT_PER_STEP));

    if (this._films.length > CARDS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsExtra() {
    this._renderFilms(this._topRatedFilmsListElement, this._filmsTopRated, 0, EXTRA_CARDS_COUNT);

    this._renderFilms(this._mostCommentedFilmsListElement, this._filmsMostCommented, 0, EXTRA_CARDS_COUNT);
  }

  _renderFilmsList() {
    this._renderSort();

    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    } else {
      this._renderAllFilms();
      this._renderFilmsExtra();
    }
  }
}
