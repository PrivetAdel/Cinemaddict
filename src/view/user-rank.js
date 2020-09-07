import AbstractView from './abstract';
import {getProfileRating} from '../utils/common';

export default class UserRank extends AbstractView {
  constructor(filmsCards) {
    super();
    this._filmsCards = filmsCards;
  }

  _createUserRankTemplate(filmsCards) {
    const profileRating = getProfileRating(filmsCards);

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
}
