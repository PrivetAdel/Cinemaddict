export const generateFilter = (filmsCards) => {
  return {
    watchlist: filmsCards.filter((filmCard) => filmCard.isWatchlist).length,
    history: filmsCards.filter((filmCard) => filmCard.isWatched).length,
    favorites: filmsCards.filter((filmCard) => filmCard.isFavorite).length
  };
};
