import UserRankView from './view/user-rank';
import MenuView from './view/menu';
import SortView from './view/sort';
import FilmsListView from './view/fimls-list';
import FilmCardView from './view/film-card';
import ShowMoreButtonView from './view/show-more-button';
import TopRatedView from './view/top-rated';
import MostCommentedView from './view/most-commented';
import MoviesCountView from './view/movies-count';
import FilmDetalisView from './view/film-details-popup';
import {generateFilmCard} from './mock/film-card';
import {generateFilter} from './mock/filters';
import {render} from './utils';

const CARDS_COUNT = 22;
const CARDS_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;
const filmsCards = new Array(CARDS_COUNT).fill(``).map(generateFilmCard);
const filmsTopRated = [...filmsCards].sort((a, b) => b.rating - a.rating);
const filmsMostCommented = [...filmsCards].sort((a, b) => b.comments.length - a.comments.length);
const filters = generateFilter(filmsCards);

const mainHeaderElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const renderFilmCard = (filmListContainer, filmCard) => {
  const filmComponent = new FilmCardView(filmCard);
  const filmDetalisComponent = new FilmDetalisView(filmCard);

  const replaceCardToDetails = () => {
    filmListContainer.replaceChild(filmDetalisComponent.getElement(), filmComponent.getElement());
  };

  const replaceDetailsToCard = () => {
    filmListContainer.replaceChild(filmComponent.getElement(), filmDetalisComponent.getElement());
  };

  filmComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => {
    replaceCardToDetails();
  });
  filmComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    replaceCardToDetails();
  });
  filmComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => {
    replaceCardToDetails();
  });

  filmDetalisComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
    replaceDetailsToCard();
  });

  render(filmListContainer, filmComponent.getElement());
};

render(mainHeaderElement, new UserRankView(filmsCards).getElement());
render(mainElement, new MenuView(filters).getElement());
render(mainElement, new SortView().getElement());
render(mainElement, new FilmsListView().getElement());

const filmsSection = mainElement.querySelector(`.films`);
render(filmsSection, new TopRatedView().getElement());
render(filmsSection, new MostCommentedView().getElement());

const footerStatistics = footer.querySelector(`.footer__statistics`);
render(footerStatistics, new MoviesCountView(filmsCards.length).getElement());

const filmsListContainersElement = mainElement.querySelectorAll(`.films-list__container`);
for (let i = 0; i < Math.min(filmsCards.length, CARDS_COUNT_PER_STEP); i++) {
  renderFilmCard(filmsListContainersElement[0], filmsCards[i]);
}
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  renderFilmCard(filmsListContainersElement[1], filmsTopRated[i]);
}
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  renderFilmCard(filmsListContainersElement[2], filmsMostCommented[i]);
}

const filmsListElement = mainElement.querySelector(`.films-list`);
const showMoreButton = new ShowMoreButtonView();
if (filmsCards.length > CARDS_COUNT_PER_STEP) {
  let renderFilmsCards = CARDS_COUNT_PER_STEP;
  render(filmsListElement, showMoreButton.getElement());

  showMoreButton.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmsCards
      .slice(renderFilmsCards, renderFilmsCards + CARDS_COUNT_PER_STEP)
      .forEach((film) => renderFilmCard(filmsListContainersElement[0], film));

    renderFilmsCards += CARDS_COUNT_PER_STEP;

    if (renderFilmsCards >= filmsCards.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  });
}
