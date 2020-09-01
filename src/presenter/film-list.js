import FilmsListView from '../view/fimls-list';
import ShowMoreButtonView from '../view/show-more-button';
import MostCommentedView from '../view/most-commented';
import TopRatedView from '../view/top-rated';
import SortView from '../view/sort';
import NoFilmsView from '../view/no-films';
import FilmPresenter from './film';
import {render, remove} from '../utils/render';
import {sortFilmDate, sortFilmRating, FilmsType, CARDS_COUNT_PER_STEP} from '../utils/common';
import {SortType, UpdateType, UserAction} from '../const';
import {filter} from '../utils/filter';

export default class FilmList {
  constructor(filmsListContainer, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsListContainer = filmsListContainer;
    this._renderedFilmsCount = CARDS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};

    this._filmsListComponent = new FilmsListView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._filmsListElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._topRatedFilmsListElement = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedFilmsListElement = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    this._noFilmsComponent = new NoFilmsView();
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlerShowMoreButtonClick = this._handlerShowMoreButtonClick.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._filmsListContainer, this._filmsListComponent);
    if (this._filmsModel.getFilms().length !== 0) {
      render(this._filmsListContainer, this._topRatedComponent);
      render(this._filmsListContainer, this._mostCommentedComponent);
    }

    this._renderFilmList();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortFilmDate);
      case SortType.RATING:
        return filteredFilms.slice().sort(sortFilmRating);
      default:
        return filteredFilms;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._ratedFilmPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._commentedFilmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._filmsModel.updateFilmCard(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilmCard(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.updateFilmCard(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilmList();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmList();
        break;
    }
  }

  _handlerSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handlerSortTypeChange);
    render(this._filmsListContainer, this._sortComponent, `before`);
  }

  _renderFilm(container, film, type) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._filmsModel, this._commentsModel);
    filmPresenter.init(film);
    switch (type) {
      case FilmsType.ALL:
        this._filmPresenter[film.id] = filmPresenter;
        break;
      case FilmsType.RATED:
        this._ratedFilmPresenter[film.id] = filmPresenter;
        break;
      case FilmsType.COMMENTED:
        this._commentedFilmPresenter[film.id] = filmPresenter;
        break;
    }
  }

  _renderFilms(container, films, type) {
    films.forEach((film) => this._renderFilm(container, film, type));
  }

  _renderNoFilms() {
    render(this._filmsListComponent, this._noFilmsComponent);
  }

  _handlerShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;

    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + CARDS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(this._filmsListElement, films, FilmsType.ALL);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._showMoreButtonComponent.setShowMoreButtonClickHandler(this._handlerShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent);
  }

  _clearFilmList({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
        .values(this._filmPresenter)
        .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = CARDS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // _renderFilmsExtra() {
  //   this._renderFilms(this._topRatedFilmsListElement, this._filmsTopRated, 0, EXTRA_CARDS_COUNT, FilmsType.RATED);
  //
  //   this._renderFilms(this._mostCommentedFilmsListElement, this._filmsMostCommented, 0, EXTRA_CARDS_COUNT, FilmsType.COMMENTED);
  // }

  _renderFilmList() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilms(this._filmsListElement, films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)), FilmsType.ALL);

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }
}
