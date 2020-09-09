import UserRankView from './view/user-rank';
import FilmsView from './view/films';
import MoviesCountView from './view/movies-count';
import FilmListPresenter from './presenter/film-list';
import MenuPresenter from './presenter/menu';
import StatisticsPresenter from './presenter/statistics';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import PageModeModel from './model/page-mode';
import {AUTHORIZATION, END_POINT, UpdateType} from './const';
import {render} from './utils/render';
import Api from './api';

const mainHeaderElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const pageModeModel = new PageModeModel();

render(mainElement, new FilmsView());

const filmsElement = mainElement.querySelector(`.films`);
const filmListPresenter = new FilmListPresenter(filmsElement, filmsModel, filterModel, api);
const statisticsPresenter = new StatisticsPresenter(mainElement, filmsModel);
const menuPresenter = new MenuPresenter(mainElement, filterModel, filmsModel, filmListPresenter, statisticsPresenter, pageModeModel);

menuPresenter.init();
filmListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(mainHeaderElement, new UserRankView(films));
    render(footerStatistics, new MoviesCountView(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    // render(mainHeaderElement, new UserRankView(films));
    // render(footerStatistics, new MoviesCountView(films.length));
  });
