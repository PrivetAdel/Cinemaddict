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

const CARDS_COUNT = 5;
const EXTRA_CARDS_COUNT = 2;

const mainHeaderElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(mainHeaderElement, createUserRankTemplate());

render(mainElement, createMenuTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createContentTemplate());

const filmsListElement = mainElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreButtonTemplate());

const filmsSection = mainElement.querySelector(`.films`);
render(filmsSection, createTopRatedTemplate());
render(filmsSection, createMostCommentedTemplate());

render(footer, createFilmDetalisPopupTemplate(), `beforeend`);

const footerStatistics = footer.querySelector(`.footer__statistics`);
render(footerStatistics, createMoviesCountTemplate());

const filmsListContainersElement = mainElement.querySelectorAll(`.films-list__container`);
for (let i = 0; i < CARDS_COUNT; i++) {
  render(filmsListContainersElement[0], createFilmCardTemplate());
}
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  render(filmsListContainersElement[1], createFilmCardTemplate());
}
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  render(filmsListContainersElement[2], createFilmCardTemplate());
}
