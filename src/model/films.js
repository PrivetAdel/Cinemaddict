import Observer from '../utils/observer';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilmCard(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          actors: film.film_info.actors,
          title: film.film_info.title,
          originalTitle: film.film_info.alternative_title,
          poster: film.film_info.poster,
          description: film.film_info.description,
          rating: film.film_info.total_rating,
          ageRating: film.film_info.age_rating,
          director: film.film_info.director,
          writers: film.film_info.writers,
          releaseDate: film.film_info.release.date !== null ? new Date(film.film_info.release.date) : film.film_info.release.date,
          runtime: film.film_info.runtime,
          country: film.film_info.release.release_country,
          genres: film.film_info.genre,
          isFavorite: film.user_details.favorite,
          isWatched: film.user_details.already_watched,
          watchingDate: film.user_details.watching_date !== null ? new Date(film.user_details.watching_date) : film.user_details.watching_date,
          isWatchlist: film.user_details.watchlist
        }
    );

    delete adaptedFilm.film_info.title;
    delete adaptedFilm.film_info.alternative_title;
    delete adaptedFilm.film_info.poster;
    delete adaptedFilm.film_info.description;
    delete adaptedFilm.film_info.total_rating;
    delete adaptedFilm.film_info.age_rating;
    delete adaptedFilm.film_info.director;
    delete adaptedFilm.film_info.writers;
    delete adaptedFilm.film_info.actors;
    delete adaptedFilm.film_info.release.date;
    delete adaptedFilm.film_info.runtime;
    delete adaptedFilm.film_info.release.release_country;
    delete adaptedFilm.film_info.genres;
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details.favorite;
    delete adaptedFilm.user_details.already_watched;
    delete adaptedFilm.user_details.watching_date;
    delete adaptedFilm.user_details.watchlist;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info": {
            "actors": film.actors,
            "age_rating": film.ageRating,
            "alternative_title": film.originalTitle,
            "description": film.description,
            "director": film.director,
            "genre": film.genres,
            "title": film.title,
            "poster": film.poster,
            "total_rating": film.rating,
            "writers": film.writers,
            "release": {
              "date": film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
              "release_country": film.country
            },
            "runtime": film.runtime
          },
          "user_details": {
            "favorite": film.isFavorite,
            "already_watched": film.isWatched,
            "watching_date": film.watchingDate instanceof Date ? film.watchingDate.toISOString() : null,
            "watchlist": film.isWatchlist
          }
        }
    );

    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.poster;
    delete adaptedFilm.description;
    delete adaptedFilm.rating;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.runtime;
    delete adaptedFilm.genres;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isWatchlist;

    return adaptedFilm;
  }
}
