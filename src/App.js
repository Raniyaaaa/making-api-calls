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
      const response = await fetch('https://movies-list-e4384-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }
      const data = await response.json();
      const loadedMovies=[];
      for(const key in data){
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate
        })
      }
      
      setMovies(loadedMovies);
      setIsRetrying(false);
    } catch (error) {
      setError(error.message);
      setIsRetrying(true);
    }
    setIsLoading(false);
  },[]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

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

  async function addMovieHandler(movie){
    const response=await fetch('https://movies-list-e4384-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body:JSON.stringify(movie),
      headers:{
        'Content-Type':'application/json'
      }
    })
    const data=await response.json();
    console.log(data)
  }

  const deleteMovieHandler=async (id)=>{
    await fetch(`https://movies-list-e4384-default-rtdb.firebaseio.com/movies/${id}.json`,{
      method:"DELETE"
    })
    setMovies((prevMovies)=>
      prevMovies.filter((movie) => movie.id !== id))
  }

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
    if (movies.length > 0) return <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler}/>;
    return <p>No Movies Found</p>;
  }, [isLoading, error, isRetrying, movies]);


  return (
    <React.Fragment>
      <section>
        <MoviesForm onAddMovie={addMovieHandler}/>
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
