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
