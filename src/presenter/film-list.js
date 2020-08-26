import FilmsListView from '../view/fimls-list';
import ShowMoreButtonView from '../view/show-more-button';
import MostCommentedView from '../view/most-commented';
import TopRatedView from '../view/top-rated';
import SortView from '../view/sort';
import NoFilmsView from '../view/no-films';
import FilmPresenter from './film';
import {render, remove} from '../utils/render';
import {sortFilmDate, sortFilmRating, updateItem} from '../utils/common';
import {SortType} from '../const';

const CARDS_COUNT_PER_STEP = 5;
// const EXTRA_CARDS_COUNT = 2;

export default class FilmList {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;
    this._renderFilmsCount = CARDS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._filmsListComponent = new FilmsListView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._filmsListElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._sortComponent = new SortView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
  }

  init(films) {
    this._films = [...films];
    this._sourcedFilms = [...films];

    render(this._filmsListContainer, this._filmsListComponent);
    render(this._filmsListContainer, this._topRatedComponent);
    render(this._filmsListContainer, this._mostCommentedComponent);

    this._renderFilmsList();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
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
    this._renderFilmsList();
  }

  _renderSort() {
    render(this._filmsListContainer, this._sortComponent, `before`);
    this._sortComponent.setSortTypeChangeHandler(this._handlerSortTypeChange);
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListElement, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _renderNoFilms() {
    render(this._filmsListComponent, this._noFilmsComponent);
  }

  _showMoreButtonClickHandler() {
    this._renderFilms(this._renderFilmsCount, this._renderFilmsCount + CARDS_COUNT_PER_STEP);
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
    Object
        .values(this._filmPresenter)
        .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderFilmsCount = CARDS_COUNT_PER_STEP;
  }

  _renderAllFilms() {
    this._renderFilms(0, Math.min(this._films.length, CARDS_COUNT_PER_STEP));

    if (this._films.length > CARDS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsList() {
    this._renderSort();

    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    } else {
      this._renderAllFilms();
    }
  }
}
