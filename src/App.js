import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  let retryTimeout = null;

  const fetchMoviesHandler = async () => {
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
  };

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

  let content = <p>No Movies Found</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {isRetrying && (
          <button onClick={cancelRetryHandler}>Cancel</button>
        )}
      </div>
    );
  }

  if (isLoading) {
    content = <p>Loading....</p>;
  }

  return (
    <React.Fragment>
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
