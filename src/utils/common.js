import moment from 'moment';
import {SHAKE_ANIMATION_TIMEOUT} from '../const';

export const shakeEffect = (element) => {
  element.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  setTimeout(() => {
    element.getElement().style.animation = ``;
  }, SHAKE_ANIMATION_TIMEOUT);
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

export const getDurationFormat = (minutes) => {
  const duration = moment.duration(minutes, `minutes`);
  const hours = `${duration.hours() > 0 ? `${duration.hours()}h` : ``}`;
  const mins = `${duration.minutes() > 0 ? `${duration.minutes()}m` : ``}`;

  return `${hours} ${mins}`;
};

export const getReleaseDate = (date, isFullDate = false) => {
  if (isFullDate) {
    return moment(date).format(`DD MMMM YYYY`);
  } else {
    return moment(date).format(`YYYY`);
  }
};

export const getCommentDate = (date) => {
  return moment(date).fromNow();
};

export const getRandomInteger = (min, max) => {
  return Math.floor((Math.random() * (max + 1 - min)) + min);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomArray = (array) => {
  const items = getRandomInteger(1, 5);
  const newArray = shuffleArray(array.slice()).slice(0, items);
  return newArray;
};

export const getWatchedFilmsCount = (films) => {
  return films.filter((film) => film.isWatched).length;
};

export const getProfileRating = (films) => {
  const watchedFilmsCount = getWatchedFilmsCount(films);

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

export const getFilmsDuration = (films) => {
  return films.reduce((count, film) => {
    return count + film.runtime;
  }, 0);
};

export const getAllGenres = (films) => {
  const allGenres = [];
  films.map((film) => allGenres.push(film.genres));

  const countObject = allGenres.flat().reduce((a, c) => {
    a[c] = a[c] || 0;
    a[c]++;
    return a;
  }, {});

  return countObject;
};

export const getTopGenre = (films) => {
  const genresObject = getAllGenres(films);

  const maxCount = Math.max(...Object.values(genresObject));

  const topGenre = ((obj, value) => {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
  });

  return topGenre(genresObject, maxCount);
};

export const sortFilmDate = (filmA, filmB) => {
  return filmB.releaseDate.getFullYear() - filmA.releaseDate.getFullYear();
};

export const sortFilmRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export const sortFilmCommentsCount = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};
