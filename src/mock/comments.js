import {getRandomInteger, generateId} from '../utils/common';

const generateCommentsText = () => {
  const commentsText = [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Aliquam id orci ut lectus varius viverra`,
    `Almost two hours? Seriously?`,
    `Aliquam erat volutpat`,
    `Nunc fermentum tortor ac porta dapibus`,
    `In rutrum ac purus sit amet tempus`
  ];
  const randomIndex = getRandomInteger(0, commentsText.length - 1);
  return commentsText[randomIndex];
};

const generateCommentsEmoji = () => {
  const commentsEmoji = [
    `angry`,
    `puke`,
    `sleeping`,
    `smile`
  ];
  const randomIndex = getRandomInteger(0, commentsEmoji.length - 1);
  return commentsEmoji[randomIndex];
};

const generateCommentsAuthor = () => {
  const commentsAuthor = [
    `Tom Ford`,
    `Leonardo DiCaprio`,
    `Tom Hardy`,
    `John Travolta`,
    `Bruce Willis`,
    `Quentin Tarantino`,
    `Russell Crowe`,
    `Joaquin Phoenix`
  ];
  const randomIndex = getRandomInteger(0, commentsAuthor.length - 1);
  return commentsAuthor[randomIndex];
};

const createCommentDate = () => {
  const commentDate = new Date();
  return commentDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`, year: `numeric`});
};

const createComment = () => {
  return {
    id: generateId(),
    text: generateCommentsText(),
    emoji: generateCommentsEmoji(),
    author: generateCommentsAuthor(),
    date: createCommentDate()
  };
};

export const createComments = () => {
  return new Array(getRandomInteger(0, 5)).fill(``).map(createComment);
};
