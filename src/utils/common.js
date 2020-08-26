export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

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

export const sortFilmDate = (filmA, filmB) => {
  return filmB.releaseDate.getFullYear() - filmA.releaseDate.getFullYear();
};

export const sortFilmRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export const sortFilmCommentsCount = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
