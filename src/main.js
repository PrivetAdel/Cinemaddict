import {createUserRankTemplate} from './view/user-rank';
import {createMenuTemplate} from './view/menu';
import {createSortTemplate} from './view/sort';
import {createContentTemplate} from './view/fimls-list';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createTopRatedTemplate} from './view/top-rated';
import {createMostCommentedTemplate} from './view/most-commented';
import {createMoviesCountTemplate} from './view/movies-count';
import {createFilmDetalisPopupTemplate} from './view/film-details-popup';
import {generateFilmCard} from './mock/film-card';
import {generateFilter} from './mock/filters';

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

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(mainHeaderElement, createUserRankTemplate(filmsCards));
render(mainElement, createMenuTemplate(filters));
render(mainElement, createSortTemplate());
render(mainElement, createContentTemplate());

const filmsSection = mainElement.querySelector(`.films`);
render(filmsSection, createTopRatedTemplate());
render(filmsSection, createMostCommentedTemplate());

render(footer, createFilmDetalisPopupTemplate(filmsCards[0]));
const filmsDetailsPopup = document.querySelector(`.film-details`);

if (filmsDetailsPopup) {
  const closeButton = filmsDetailsPopup.querySelector(`.film-details__close-btn`);
  const closePopupHandler = () => {
    filmsDetailsPopup.classList.add(`visually-hidden`);
  };
  closeButton.addEventListener(`click`, closePopupHandler);
}

const footerStatistics = footer.querySelector(`.footer__statistics`);
render(footerStatistics, createMoviesCountTemplate(filmsCards.length));

const filmsListContainersElement = mainElement.querySelectorAll(`.films-list__container`);
for (let i = 0; i < Math.min(filmsCards.length, CARDS_COUNT_PER_STEP); i++) {
  render(filmsListContainersElement[0], createFilmCardTemplate(filmsCards[i]));
}
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  render(filmsListContainersElement[1], createFilmCardTemplate(filmsTopRated[i]));
}
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  render(filmsListContainersElement[2], createFilmCardTemplate(filmsMostCommented[i]));
}

const filmsListElement = mainElement.querySelector(`.films-list`);
if (filmsCards.length > CARDS_COUNT_PER_STEP) {
  let renderFilmsCards = CARDS_COUNT_PER_STEP;
  render(filmsListElement, createShowMoreButtonTemplate());

  const showMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmsCards
      .slice(renderFilmsCards, renderFilmsCards + CARDS_COUNT_PER_STEP)
      .forEach((filmCard) => render(filmsListContainersElement[0], createFilmCardTemplate(filmCard)));

    renderFilmsCards += CARDS_COUNT_PER_STEP;

    if (renderFilmsCards >= filmsCards.length) {
      showMoreButton.remove();
    }
  });
}
