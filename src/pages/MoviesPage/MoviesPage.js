import { useState, useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import { fetchMovies } from '../../services/tmdb-api';
import Status from '../../services/Status';
import ErrorText from '../../components/ErrorText';
import Searchbar from '../../components/Searchbar';
import MoviesList from '../../components/MoviesList';
import Preloader from '../../components/Preloader';
import styles from './MoviesPage.module.css';

function MoviesPage() {
  const [query, setQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState(Status.IDLE);
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const { url } = useRouteMatch();

  const page = new URLSearchParams(location.search).get('page') ?? 1;

  useEffect(() => {
    if (location.search === '') {
      return;
    }

    const newQuery = new URLSearchParams(location.search).get('query');
    setQuery(newQuery, page);
  }, [location.search, page]);

  useEffect(() => {
    const fetchQueryMovies = async () => {
      setStatus(Status.PENDING);
      try {
        const { results, total_pages } = await fetchMovies(query, page);
        if (results.length === 0) {
          setError(`Nothing was found for your query "${query}"`);
          setStatus(Status.REJECTED);
          return;
        }
        setMovies(results);
        setTotalPages(total_pages);
        setStatus(Status.RESOLVED);
      } catch (error) {
        setStatus(Status.REJECTED);
      }
    };
    fetchQueryMovies();
  }, [query, page]);

  const searchHandler = query => {
    setQuery(query);
    history.push({ ...location, search: `query=${query}&page=1` });
  };

  const pageHandler = (event, page) => {
    history.push({ ...location, search: `query=${query}&page=${page}` });
  };

  return (
    <>
      <Searchbar onSubmit={searchHandler} />
      {status === Status.PENDING && <Preloader />}
      {status === Status.RESOLVED && (
        <>
          <MoviesList movies={movies} url={url} />
          {totalPages > 1 && (
            <div className={styles.wrapper}>
              <Pagination
                count={totalPages}
                onChange={pageHandler}
                page={Number(page)}
              />
            </div>
          )}
        </>
      )}
      {status === Status.REJECTED && error && <ErrorText message={error} />}
    </>
  );
}

export default MoviesPage;