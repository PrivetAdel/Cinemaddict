import UserRankView from './view/user-rank';
import MenuView from './view/menu';
import FilmsView from './view/films';
import MoviesCountView from './view/movies-count';
import FilmListPresenter from './presenter/film-list';
import {generateFilmCard} from './mock/film-card';
import {generateFilter} from './mock/filters';
import {render} from './utils/render';

const CARDS_COUNT = 22;

const filmsCards = new Array(CARDS_COUNT).fill(``).map(generateFilmCard);
const filters = generateFilter(filmsCards);

const mainHeaderElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

render(mainHeaderElement, new UserRankView(filmsCards));
render(mainElement, new MenuView(filters));
render(mainElement, new FilmsView());

const filmsElement = mainElement.querySelector(`.films`);
const filmListPresenter = new FilmListPresenter(filmsElement);
filmListPresenter.init(filmsCards);

render(footerStatistics, new MoviesCountView(filmsCards.length));
