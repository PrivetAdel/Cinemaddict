import he from 'he';
import {getCommentDate} from '../utils/common';
import SmartView from './smart';

export default class Comments extends SmartView {
  constructor(comment) {
    super();
    this._comment = comment;

    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  getTemplate() {
    const commentDate = getCommentDate(new Date(this._comment.date));

    return `<li class="film-details__comment" id="${this._comment.id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${this._comment.emotion}.png" width="55" height="55" alt="emoji-${this._comment.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(this._comment.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${this._comment.author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
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
