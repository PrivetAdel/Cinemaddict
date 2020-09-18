import he from 'he';
import {getCommentDate} from '../utils/common';
import AbstractView from './abstract';

const ButtonText = {
  DELETING: `Deleting...`,
  DELETE: `Delete`
};

export default class Comments extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;

    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  _createCommentsTemplate() {
    const {date, id, emotion, comment, author} = this._comment;
    const commentDate = getCommentDate(new Date(date));

    return (
      `<li class="film-details__comment" id="${id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(comment)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  }

  getTemplate() {
    return this._createCommentsTemplate();
  }

  setDeletingState() {
    this.getElement().querySelector(`.film-details__comment-delete`).textContent = ButtonText.DELETING;
  }

  setDeleteState() {
    this.getElement().querySelector(`.film-details__comment-delete`).textContent = ButtonText.DELETE;
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._comment);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteButtonClickHandler);
  }
}
