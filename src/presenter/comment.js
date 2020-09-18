import CommentsView from '../view/comments';
import {render, remove} from '../utils/render';
import {UserAction, UpdateType} from '../const';
import {shakeEffect} from '../utils/common';

export default class Comment {
  constructor(commentsContainer, removeData) {
    this._commentsContainer = commentsContainer;
    this._removeData = removeData;
    this._comment = null;

    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._commentComponent = new CommentsView(this._comment);
    this._commentComponent.setCommentDeleteClickHandler(this._handleCommentDeleteClick);
    render(this._commentsContainer, this._commentComponent);
  }

  shakeDeletingComment() {
    shakeEffect(this._commentComponent);
  }

  disabledButton() {
    this._commentComponent.getElement().querySelector(`.film-details__comment-delete`).disabled = true;
  }

  setDeletingState() {
    return this._commentComponent.setDeletingState();
  }

  setDeleteState() {
    return this._commentComponent.setDeleteState();
  }

  deployButton() {
    this._commentComponent.getElement().querySelector(`.film-details__comment-delete`).disabled = false;
  }

  destroy() {
    remove(this._commentComponent);
  }

  _handleCommentDeleteClick() {
    this._removeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH_PLUS,
        this._comment
    );
  }
}
