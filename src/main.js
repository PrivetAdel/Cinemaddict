import UserRankView from './view/user-rank';
import FilmsView from './view/films';
import MoviesCountView from './view/movies-count';
import FilmListPresenter from './presenter/film-list';
import MenuPresenter from './presenter/menu';
import StatisticsPresenter from './presenter/statistics';
import Api from './api/index';
import Store from './api/store';
import Provider from './api/provider';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import PageModel from './model/page';
import {AUTHORIZATION, END_POINT, STORE_NAME, UpdateType} from './const';
import {render} from './utils/render';

const mainHeaderElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const pageModeModel = new PageModel();

render(mainElement, new FilmsView());

const filmsElement = mainElement.querySelector(`.films`);
const filmListPresenter = new FilmListPresenter(filmsElement, filmsModel, filterModel, apiWithProvider);
const statisticsPresenter = new StatisticsPresenter(mainElement, filmsModel);
const menuPresenter = new MenuPresenter(mainElement, filterModel, filmsModel, filmListPresenter, statisticsPresenter, pageModeModel);

menuPresenter.init();
filmListPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(mainHeaderElement, new UserRankView(films));
    render(footerStatistics, new MoviesCountView(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
