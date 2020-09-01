import FilmCardView from '../view/film-card';
import FilmDetalisView from '../view/film-details-popup';
import CommentsModel from '../model/comments';
import CommentListPresenter from './comment-list';
import {render, replace, remove} from '../utils/render';
import {Mode, UserAction, UpdateType} from '../const';

export default class Film {
  constructor(filmsListContainer, changeData, changeMode, filmsModel) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filmsModel = filmsModel;
    this._commentsModel = new CommentsModel();

    this._filmComponent = null;
    this._filmDetalisComponent = null;
    this._commentPresenter = null;
    this._mode = Mode.DEFAULT;

    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDetailsCloseClick = this._handleDetailsCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._handleCommentListUpdate = this._handleCommentListUpdate.bind(this);
  }

  init(film) {
    this._film = film;
    this._commentsModel.setComments(this._film.comments);

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetalisComponent = this._filmDetalisComponent;

    this._filmComponent = new FilmCardView(film);
    this._initDetailsCard();

    this._filmComponent.setFilmCardClickHandler(this._handleCardClick);
    this._filmComponent.setAddtoWatchClickHandler(this._handleAddToWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmDetalisComponent.setCloseButtonClickHandler(this._handleDetailsCloseClick);

    if (prevFilmComponent === null || !prevFilmDetalisComponent === null) {
      render(this._filmsListContainer, this._filmComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmDetalisComponent, prevFilmDetalisComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetalisComponent);
  }

  _initDetailsCard() {
    this._filmDetalisComponent = new FilmDetalisView(this._film);
    this._commentsConteiner = this._filmDetalisComponent.getElement().querySelector(`.film-details__comments-list`);
    this._newCommentConteiner = this._filmDetalisComponent.getElement().querySelector(`.film-details__comments-wrap`);

    this._commentListPresenter = new CommentListPresenter(this._commentsConteiner, this._newCommentConteiner, this._film, this._handleCommentListUpdate, this._commentsModel);
    this._commentListPresenter.init(this._film.comments);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetalisComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceDetailsToCard();
    }
  }

  _replaceCardToDetails() {
    replace(this._filmDetalisComponent, this._filmComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _replaceDetailsToCard() {
    replace(this._filmComponent, this._filmDetalisComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._filmDetalisComponent.reset(this._film);
      this._replaceDetailsToCard();
    }
  }

  _handleCommentListUpdate() {
    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              comments: this._commentsModel.getComments()
            }
        )
    );
  }

  _handleAddToWatchListClick() {
    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isWatchlist: !this._film.isWatchlist
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM_CARD,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleCardClick() {
    this._replaceCardToDetails();
  }

  _handleDetailsCloseClick(update) {
    this._changeData(UserAction.UPDATE_FILM_CARD, UpdateType.PATCH, update);
    this._replaceDetailsToCard();
  }
}
