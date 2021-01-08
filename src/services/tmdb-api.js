import axios from 'axios';

const API_KEY = 'a0af0405af148f9ebed934a58d0f59de';
const BASE_URL = 'https://api.themoviedb.org/3';

axios.defaults.baseURL = BASE_URL;
axios.defaults.params = { api_key: API_KEY };

const fetchTrendingMovies = async (page = 1) => {
  try {
    const { data } = await axios.get(`/trending/movie/day?page=${page}`);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { fetchTrendingMovies };
// https://developers.themoviedb.org/3/trending/get-trending - список самых популярных фильмов на сегодня для создания коллекции на главной странице.
// https://developers.themoviedb.org/3/search/search-movies - поиск кинофильма по ключевому слову на странице фильмов.
// https://developers.themoviedb.org/3/movies/get-movie-details - запрос полной информации о фильме для страницы кинофильма.
// https://developers.themoviedb.org/3/movies/get-movie-credits - запрос информации о актёрском составе для страницы кинофильма.
// https://developers.themoviedb.org/3/movies/get-movie-reviews - запрос обзоров для страницы кинофильма.