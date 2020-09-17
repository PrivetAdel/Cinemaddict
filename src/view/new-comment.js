import SmartView from './smart';

export default class NewComment extends SmartView {
  constructor(film) {
    super();
    this._data = NewComment.parseFilmToData(film);

    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);

    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);

    this._setInnerHandlers();
  }

  _createCommentsSectionTemplate() {
    const {emotion} = this._data;
    return `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ``}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emotion === `smile` ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emotion === `sleeping` ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emotion === `puke` ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emotion === `angry` ? `checked` : ``}>
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>`;
  }

  getTemplate() {
    return this._createCommentsSectionTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.getElement().addEventListener(`keydown`, this._commentSubmitHandler);
  }

  getNewComment() {
    return Object.assign(
        {},
        this._data,
        {
          date: new Date().toISOString()
        }
    );
  }

  getTextareaErrorColor() {
    this.getElement().querySelector(`.film-details__comment-input`).style.borderColor = `red`;
  }

  getEmojiLabelErrorColor() {
    this.getElement().querySelector(`.film-details__add-emoji-label`).style.borderColor = `red`;
  }

  getBorderColor() {
    this.getElement().querySelector(`.film-details__comment-input`).style.borderColor = `#979797`;
    this.getElement().querySelector(`.film-details__add-emoji-label`).style.borderColor = `#979797`;
  }

  disabledNewCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach(function (item) {
      item.disabled = true;
    });
  }

  deployNewCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach(function (item) {
      item.disabled = false;
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiClickHandler);
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value
    }, true);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value
    });
  }

  _commentSubmitHandler(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      evt.preventDefault();
      this._callback.submitComment();
    }
  }

  setSubmitCommentHandler(callback) {
    this._callback.submitComment = callback;
    this.getElement().addEventListener(`keydown`, this._commentSubmitHandler);
  }

  static parseFilmToData(film) {
    return Object.assign({}, film);
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.emoji;

    return data;
  }
}
