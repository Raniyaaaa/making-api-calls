import React, { useState, useEffect, useCallback,useMemo } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import MoviesForm from './components/MoviesForm';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  let retryTimeout = null;

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setIsRetrying(false);
    } catch (error) {
      setError(error.message);
      setIsRetrying(true);
    }
    setIsLoading(false);
  },[]);

  useEffect(() => {
    fetchMoviesHandler();
  }, []);

  useEffect(() => {
    if (isRetrying) {
      retryTimeout = setTimeout(fetchMoviesHandler, 5000);
    }
    return () => clearTimeout(retryTimeout);
  }, [isRetrying, fetchMoviesHandler]);

  const cancelRetryHandler = () => {
    setIsRetrying(false);
    setError("Retrying cancelled by user");
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  };
  const content = useMemo(() => {
    if (isLoading) return <p>Loading....</p>;
    if (error) {
      return (
        <div>
          <p>{error}</p>
          {isRetrying && <button onClick={cancelRetryHandler}>Cancel</button>}
        </div>
      );
    }
    if (movies.length > 0) return <MoviesList movies={movies} />;
    return <p>No Movies Found</p>;
  }, [isLoading, error, isRetrying, movies]);

  return (
    <React.Fragment>
      <section>
        <MoviesForm/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading || isRetrying}>
          Fetch Movies
        </button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
