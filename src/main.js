import UserRankView from './view/user-rank';
import FilmsView from './view/films';
import MoviesCountView from './view/movies-count';
import FilmListPresenter from './presenter/film-list';
import FilterPresenter from './presenter/filters';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import {generateFilmCard} from './mock/film-card';
import {render} from './utils/render';

const CARDS_COUNT = 22;

const filmsCards = new Array(CARDS_COUNT).fill(``).map(generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsCards);
const filterModel = new FilterModel();

const mainHeaderElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

render(mainHeaderElement, new UserRankView(filmsCards));
render(mainElement, new FilmsView());

const filmsElement = mainElement.querySelector(`.films`);
const filmListPresenter = new FilmListPresenter(filmsElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);

filterPresenter.init();
filmListPresenter.init();

render(footerStatistics, new MoviesCountView(filmsCards.length));
