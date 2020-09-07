import CommentPresenter from './comment';
import NewCommentView from '../view/new-comment';
import {UserAction, UpdateType} from '../const';
import {render, remove} from '../utils/render';

export default class CommentList {
  constructor(commentsContainer, newCommentConteiner, film, changeCommentData, commentsModel) {
    this._commentsContainer = commentsContainer;
    this._newCommentConteiner = newCommentConteiner;
    this._film = film;
    this._commentsModel = commentsModel;
    this._changeCommentData = changeCommentData;
    this._commentPresenter = {};

    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
  }

  init(comments) {
    this._commentsModel.setComments(comments);
    this._renderCommentsList();

    this._newCommentComponent = new NewCommentView();
    render(this._newCommentConteiner, this._newCommentComponent);
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
    this._commentsModel.deleteComment(updateType, update);
    this._commentPresenter[update.id].destroy();

    this._changeCommentData(
        userAction,
        updateType,
        Object.assign(
            {},
            this._film,
            {
              comments: this._commentsModel.getComments()
            }
        )
    );
  }

  _handleCommentSubmit() {
    this._commentsModel.addComment(UpdateType.PATCH, this._newCommentComponent.getNewComment());

    this._changeCommentData(
        UserAction.ADD_COMMENT,
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

  _renderComment(comment) {
    this._comment = comment;
    const commentPresenter = new CommentPresenter(this._commentsContainer, this._handleCommentDeleteClick);
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
