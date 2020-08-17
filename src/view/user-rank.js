import {createElement} from '../utils';

const createProfileRating = (filmsCards) => {
  const watchedFilmsCount = filmsCards.filter((filmCard) => filmCard.isWatched).length;

  switch (true) {
    case (watchedFilmsCount >= 1 && watchedFilmsCount <= 10):
      return `novice`;
    case (watchedFilmsCount >= 11 && watchedFilmsCount <= 20):
      return `fan`;
    case (watchedFilmsCount >= 21):
      return `movie buff`;
    default:
      return ``;
  }
};

export default class UserRank {
  constructor(filmsCards) {
    this._filmsCards = filmsCards;
    this._element = null;
  }

  _createUserRankTemplate(filmsCards) {
    const profileRating = createProfileRating(filmsCards);

    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${profileRating}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }

  getTemplate() {
    return this._createUserRankTemplate(this._filmsCards);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
