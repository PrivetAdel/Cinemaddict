import SmartView from './smart';

export default class Comments extends SmartView {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return `<li id="${this._comment.id}" class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${this._comment.emoji}.png" width="55" height="55" alt="emoji-${this._comment.emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${this._comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${this._comment.author}</span>
          <span class="film-details__comment-day">${this._comment.date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }
}
