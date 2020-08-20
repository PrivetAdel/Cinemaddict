import AbstractView from './abstract';

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

export default class UserRank extends AbstractView {
  constructor(filmsCards) {
    super();
    this._filmsCards = filmsCards;
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
}
