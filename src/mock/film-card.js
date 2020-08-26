import {getRandomInteger, getRandomArray, generateId} from '../utils/common';
import {createComments} from './comments';

const generateName = () => {
  const names = [
    `Made for each other`,
    `Popeye meets Sinbad`,
    `Sagebrush trail`,
    `Santa claus conquers the martians`,
    `The dance of life`,
    `The great flamarion`,
    `The man with the golden arm`
  ];
  const randomIndex = getRandomInteger(0, names.length - 1);
  return names[randomIndex];
};

const generateDescription = () => {
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  return getRandomArray(descriptions).join(` `);
};

const generatePoster = () => {
  const posters = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`
  ];
  const randomIndex = getRandomInteger(0, posters.length - 1);
  return posters[randomIndex];
};

const createRating = () => {
  return ((Math.random() * (9 + 1 - 3)) + 3).toFixed(1);
};

const generateGenres = () => {
  const genres = [
    `Drama`,
    `Film-Noir`,
    `Mystery`,
    `Cartoon`
  ];
  return getRandomArray(genres);
};

export const generateFilmCard = () => {
  return {
    id: generateId(),
    title: generateName(),
    originalTitle: ``,
    poster: generatePoster(),
    description: generateDescription(),
    rating: createRating(),
    director: `Anthony Mann`,
    writers: [`Anne Wigton`, `Heinz Herald`, `Richard Weil`],
    actors: [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`],
    releaseDate: new Date(),
    runtime: `1h 30m`,
    country: `USA`,
    genres: generateGenres(),
    comments: createComments(),
    isFavorite: !!getRandomInteger(0, 1),
    isWatched: !!getRandomInteger(0, 1),
    isWatchlist: !!getRandomInteger(0, 1)
  };
};
