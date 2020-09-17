import CommentPresenter from './comment';
import NewCommentView from '../view/new-comment';
import CommentsWrapView from '../view/comments-wrap';
import {UserAction, UpdateType} from '../const';
import {render, remove} from '../utils/render';
import {shakeEffect} from '../utils/common';

export default class CommentList {
  constructor(commentsContainer, film, changeCommentData, commentsModel, api) {
    this._commentsContainer = commentsContainer;
    this._film = film;
    this._commentsModel = commentsModel;
    this._changeCommentData = changeCommentData;
    this._commentPresenter = {};
    this._api = api;

    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
  }

  init() {
    this._commentsWrapComponent = new CommentsWrapView(this._commentsModel.getComments());
    render(this._commentsContainer, this._commentsWrapComponent);

    this._commentListConteiner = this._commentsWrapComponent.getElement().querySelector(`.film-details__comments-list`);

    this._renderCommentsList();

    this._newCommentComponent = new NewCommentView();
    render(this._commentListConteiner, this._newCommentComponent);
    this._newCommentComponent.setSubmitCommentHandler(this._handleCommentSubmit);
  }

  destroy() {
    remove(this._newCommentComponent);

    Object
        .values(this._commentPresenter)
        .forEach((presenter) => presenter.destroy());
    this._commentPresenter = {};
  }

  _handleCommentDeleteClick(userAction, updateType, update) {
    this._commentPresenter[update.id].setDeletingState();
    Object
        .values(this._commentPresenter)
        .forEach((presenter) => presenter.disabledButton());

    this._api.deleteComment(update).then(() => {
      this._commentsModel.deleteComment(updateType, update);
      this._changeCommentData(
          userAction,
          updateType,
          this._film
      );
    }).catch(() => {
      this._commentPresenter[update.id].shakeDeletingComment();
      this._commentPresenter[update.id].setDeleteState();
      Object
          .values(this._commentPresenter)
          .forEach((presenter) => presenter.deployButton());
    });
  }

  _handleCommentSubmit() {
    const newComment = this._newCommentComponent.getNewComment();

    if (!(`emotion` in newComment) || !(`comment` in newComment)) {
      shakeEffect(this._newCommentComponent);

      if (!(`emotion` in newComment)) {
        this._newCommentComponent.getEmojiLabelErrorColor();
      }

      if (!(`comment` in newComment)) {
        this._newCommentComponent.getTextareaErrorColor();
      }

    } else {
      this._newCommentComponent.getBorderColor();
      this._newCommentComponent.disabledNewCommentForm();
      this._api.addComment(this._film, newComment)
        .then((response) => {
          this._commentsModel.addComment(UpdateType.PATCH, response.comments);

          this._changeCommentData(
              UserAction.ADD_COMMENT,
              UpdateType.PATCH,
              this._film,
              {
                comments: this._commentsModel.getComments()
              }
          );
        })
        .catch(() => {
          shakeEffect(this._newCommentComponent);
          this._newCommentComponent.deployNewCommentForm();
        });
    }
  }

  _renderComment(comment) {
    this._comment = comment;
    const commentPresenter = new CommentPresenter(this._commentListConteiner, this._handleCommentDeleteClick);
    commentPresenter.init(this._comment);
    this._commentPresenter[this._comment.id] = commentPresenter;
  }

  _renderComments(comments) {
    comments.forEach((comment) => this._renderComment(comment));
  }

  _renderCommentsList() {
    const comments = this._commentsModel.getComments();
    this._renderComments(comments);
  }
}
