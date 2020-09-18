export const BAR_HEIGHT = 50;
export const CARDS_COUNT_PER_STEP = 5;
export const EXTRA_CARDS_COUNT = 2;
export const AUTHORIZATION = `Basic dfiufoguhoikhb8746rfdvgc`;
export const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `12`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const UserAction = {
  UPDATE_FILM_CARD: `UPDATE_FILM_CARD`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  PATCH_PLUS: `PATCH_PLUS`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const PageMode = {
  FILMS: `FILMS`,
  STATISTICS: `STATISTICS`
};

export const StatisticPeriod = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const FilmsType = {
  ALL: `ALL`,
  RATED: `RATED`,
  COMMENTED: `COMMENTED`
};
