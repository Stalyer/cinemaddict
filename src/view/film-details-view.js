import AbstractView from '../framework/view/abstract-view.js';
import {render} from '../framework/render.js';
import dayjs from 'dayjs';
import {converterMinutesToDuration} from '../utils/film.js';
import CommentListView from './comments-list-view.js';

const createFilmDetailsTemplate = (film) => {
  const {filmInfo, userDetails} = film;
  const watchlistClassName = userDetails.watchlist ? ' film-details__control-button--active' : '';
  const alreadyWatchedClassName = userDetails.alreadyWatched ? ' film-details__control-button--active' : '';
  const favoriteClassName = userDetails.favorite ? ' film-details__control-button--active' : '';

  const createGenresTemplate = (genres) => {
    let genresTempalte = '';
    genres.forEach((genre) => {
      genresTempalte += `<span class="film-details__genre">${genre}</span>`;
    });
    return genresTempalte;
  };

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

                    <p class="film-details__age">${filmInfo.ageRating}+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${filmInfo.title}</h3>
                        <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${filmInfo.director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${dayjs(filmInfo.release.date).format('DD MMM YYYY')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${converterMinutesToDuration(filmInfo.runtime)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genres</td>
                        <td class="film-details__cell">
                          ${createGenresTemplate(filmInfo.genre)}
                        </td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${filmInfo.description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container"></div>
            </form>
          </section>`;
};

export default class FilmDetailsView extends AbstractView {
  #film = null;
  #filmCommentsIds = null;
  #commentsItems = [];

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#filmCommentsIds = this.#film.comments;
    this.#commentsItems = comments;

    if (this.#filmCommentsIds) {
      this.addComments(this.#filmCommentsIds, this.#commentsItems);
    }
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  setOnCloseBtnClick = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseBtnClick);
  };

  setOnWatchlistClick = (callback) => {
    this._callback.watchlistClick  = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  setOnWatchedClick = (callback) => {
    this._callback.watchedClick  = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#onWatchedClick);
  };

  setOnFavoriteClick = (callback) => {
    this._callback.favoriteClick  = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#onFavoriteClick);
  };

  #onCloseBtnClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  addComments(commentsIds, comments) {
    render(new CommentListView(commentsIds, comments), this.element.querySelector('.film-details__bottom-container'));
  }

}
