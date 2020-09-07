import UserRankView from './view/user-rank';
import FilmsView from './view/films';
import MoviesCountView from './view/movies-count';
import FilmListPresenter from './presenter/film-list';
import MenuPresenter from './presenter/menu';
import StatisticsPresenter from './presenter/statistics';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import PageModeModel from './model/page-mode';
import {generateFilmCard} from './mock/film-card';
import {render} from './utils/render';

const CARDS_COUNT = 22;

const filmsCards = new Array(CARDS_COUNT).fill(``).map(generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsCards);
const filterModel = new FilterModel();
const pageModeModel = new PageModeModel();

const mainHeaderElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

render(mainHeaderElement, new UserRankView(filmsCards));
render(mainElement, new FilmsView());

const filmsElement = mainElement.querySelector(`.films`);
const filmListPresenter = new FilmListPresenter(filmsElement, filmsModel, filterModel);
const statisticsPresenter = new StatisticsPresenter(mainElement, filmsModel);
const menuPresenter = new MenuPresenter(mainElement, filterModel, filmsModel, filmListPresenter, statisticsPresenter, pageModeModel);

menuPresenter.init();
filmListPresenter.init();

render(footerStatistics, new MoviesCountView(filmsCards.length));
