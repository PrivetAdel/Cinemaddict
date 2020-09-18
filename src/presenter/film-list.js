import FilmsContainerView from '../view/fimls-container';
import ShowMoreButtonView from '../view/show-more-button';
import MostCommentedView from '../view/most-commented';
import TopRatedView from '../view/top-rated';
import SortView from '../view/sort';
import NoFilmsView from '../view/no-films';
import LoadingView from '../view/loading';
import FilmPresenter from './film';
import {render, remove} from '../utils/render';
import {sortFilmByDate, sortFilmByRating, sortFilmByCommentsCount} from '../utils/common';
import {CARDS_COUNT_PER_STEP, EXTRA_CARDS_COUNT, SortType, UpdateType, UserAction, FilmsType} from '../const';
import {filter} from '../utils/filter';

export default class FilmList {
  constructor(filmsSectionContainer, filmsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsSectionContainer = filmsSectionContainer;
    this._api = api;
    this._renderedFilmsCount = CARDS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};
    this._isLoading = true;

    this._filmsContainerComponent = new FilmsContainerView();
    this._topRatedComponent = new TopRatedView();
    this._mostCommentedComponent = new MostCommentedView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlerShowMoreButtonClick = this._handlerShowMoreButtonClick.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
  }

  init() {
    this._filmsListElement = this._filmsContainerComponent.getElement().querySelector(`.films-list__container`);
    this._topRatedFilmsListElement = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedFilmsListElement = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);

    render(this._filmsSectionContainer, this._filmsContainerComponent);

    this._renderFilmList();

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearFilmList({resetRenderedFilmsCount: true, resetSortType: true});

    remove(this._filmsContainerComponent);
    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _renderLoading() {
    render(this._filmsContainerComponent, this._loadingComponent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortFilmByDate);
      case SortType.RATING:
        return filteredFilms.slice().sort(sortFilmByRating);
      default:
        return filteredFilms;
    }
  }

  _getTopRatedFilms() {
    const topRatedFilms = this._filmsModel.getFilms()
      .slice()
      .filter((film) => film.rating > 0)
      .sort(sortFilmByRating);

    return topRatedFilms.slice(0, EXTRA_CARDS_COUNT);
  }

  _renderTopRatedFilmList() {
    if (this._filmsTopRated.length === 0) {
      return;
    }

    render(this._filmsSectionContainer, this._topRatedComponent);

    this._renderFilms(this._topRatedFilmsListElement, this._filmsTopRated, FilmsType.RATED);
  }

  _renderTopRatedFilmsBlock() {
    this._filmsTopRated = this._getTopRatedFilms();
    this._renderTopRatedFilmList();
  }

  _getMostCommentedFilms() {
    const mostCommentedFilms = this._filmsModel.getFilms()
      .slice()
      .filter((film) => film.comments.length > 0)
      .sort(sortFilmByCommentsCount);

    return mostCommentedFilms.slice(0, EXTRA_CARDS_COUNT);
  }

  _renderMostCommentedFilmsList() {
    if (this._filmsMostCommented.length === 0) {
      return;
    }

    render(this._filmsSectionContainer, this._mostCommentedComponent);

    this._renderFilms(this._mostCommentedFilmsListElement, this._filmsMostCommented, FilmsType.COMMENTED);
  }

  _clearMostCommentedFilmsBlock() {
    Object
        .values(this._commentedFilmPresenter)
        .forEach((presenter) => presenter.destroy());
    this._commentedFilmPresenter = {};
  }

  _renderMostCommentedFilmsBlock() {
    this._filmsMostCommented = this._getMostCommentedFilms();
    this._renderMostCommentedFilmsList();
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
      case UserAction.ADD_COMMENT:
      case UserAction.DELETE_COMMENT:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilmCard(updateType, response);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateFilms(data);
        break;
      case UpdateType.PATCH_PLUS:
        this._updateFilms(data);
        this._clearMostCommentedFilmsBlock();
        this._renderMostCommentedFilmsBlock();
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilmList();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmList();
        break;
    }
  }

  _updateFilms(data) {
    if (data.id in this._filmPresenter) {
      this._filmPresenter[data.id].init(data);
    }
    if (data.id in this._ratedFilmPresenter) {
      this._ratedFilmPresenter[data.id].init(data);
    }
    if (data.id in this._commentedFilmPresenter) {
      this._commentedFilmPresenter[data.id].init(data);
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
    render(this._filmsSectionContainer, this._sortComponent, `before`);
  }

  _renderFilm(container, film, type) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._filmsModel, this._api);
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
    render(this._filmsContainerComponent, this._noFilmsComponent);
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

    render(this._filmsContainerComponent, this._showMoreButtonComponent);
  }

  _clearFilmList({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
        .values(this._filmPresenter)
        .forEach((presenter) => presenter.destroy());
    Object
        .values(this._ratedFilmPresenter)
        .forEach((presenter) => presenter.destroy());
    Object
        .values(this._commentedFilmPresenter)
        .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = CARDS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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

    this._renderTopRatedFilmsBlock();
    this._renderMostCommentedFilmsBlock();
  }
}
