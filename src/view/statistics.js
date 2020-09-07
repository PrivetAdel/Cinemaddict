import moment from 'moment';
import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getCurrentDate, getWatchedFilmsCount, getProfileRating, getFilmsDuration, getTopGenre, getAllGenres} from '../utils/common';
import {StatisticPeriod, BAR_HEIGHT} from '../const';

const renderGenreChart = (statisticCtx, films) => {
  const genres = Object.keys(getAllGenres(films));
  const genresCount = Object.values(getAllGenres(films));
  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._films = films;
    this._data = {
      watchedFilms: films.filter((film) => film.isWatched),
      currentPeriod: StatisticPeriod.ALL_TIME
    };

    this._genreChart = null;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setChart();
  }

  _createStatisticsTemplate(films, period) {
    const {watchedFilms, currentPeriod} = period;
    const rankLabel = getProfileRating(films);
    const watchedFilmsCount = getWatchedFilmsCount(watchedFilms);
    const filmsDuration = getFilmsDuration(watchedFilms);
    const totalDurationHours = Math.floor(filmsDuration / 60);
    const totalDurationMinutes = filmsDuration % 60;
    const topGenre = watchedFilms.length > 0 ? getTopGenre(watchedFilms) : ``;

    return `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rankLabel}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentPeriod === StatisticPeriod.ALL_TIME ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentPeriod === StatisticPeriod.TODAY ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentPeriod === StatisticPeriod.WEEK ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentPeriod === StatisticPeriod.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentPeriod === StatisticPeriod.YEAR ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`;
  }

  getTemplate() {
    return this._createStatisticsTemplate(this._films, this._data);
  }

  restoreHandlers() {
    this._setChart();
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    if (evt.target.classList.contains(`statistic__filters-input`)) {
      evt.preventDefault();

      const dateAWeekAgo = moment().subtract(7, `days`);
      const dateAMonthAgo = moment().subtract(1, `month`);
      const dateAYearAgo = moment().subtract(1, `years`);

      let update;
      switch (evt.target.value) {
        case StatisticPeriod.ALL_TIME:
          update = {
            watchedFilms: this._films.filter((film) => film.isWatched),
            currentPeriod: StatisticPeriod.ALL_TIME
          };
          break;
        case StatisticPeriod.TODAY:
          update = {
            watchedFilms: this._films.filter((film) => film.isWatched && moment(film.watchingDate).isSame(getCurrentDate(), `day`)),
            currentPeriod: StatisticPeriod.TODAY
          };
          break;
        case StatisticPeriod.WEEK:
          update = {
            watchedFilms: this._films.filter((film) => film.isWatched && moment(film.watchingDate).isBetween(dateAWeekAgo, getCurrentDate())),
            currentPeriod: StatisticPeriod.WEEK
          };
          break;
        case StatisticPeriod.MONTH:
          update = {
            watchedFilms: this._films.filter((film) => film.isWatched && moment(film.watchingDate).isBetween(dateAMonthAgo, getCurrentDate())),
            currentPeriod: StatisticPeriod.MONTH
          };
          break;
        case StatisticPeriod.YEAR:
          update = {
            watchedFilms: this._films.filter((film) => film.isWatched && moment(film.watchingDate).isBetween(dateAYearAgo, getCurrentDate())),
            currentPeriod: StatisticPeriod.YEAR
          };
          break;
      }

      this.updateData(update);
      this._setChart();
    }
  }

  _setChart() {
    if (this._genreChart !== null) {
      this._genreChart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    this._genreChart = renderGenreChart(statisticCtx, this._data.watchedFilms);
  }
}
