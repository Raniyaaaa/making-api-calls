import React, { useState } from "react";
import "./MoviesForm.module.css"

const MoviesForm = (props) => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [openingText, setOpeningText] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const submitMovieHandler = (event) => {
    event.preventDefault();
    const newMovie = {
      title,
      openingText,
      releaseDate,
    };
    props.onAddMovie(newMovie)

    setTitle('');
    setOpeningText('');
    setReleaseDate('');
  };

  return (
    <section>
      <form onSubmit={submitMovieHandler}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            
          />
        </label>
        <label>
          Opening Text
          <textarea
            rows="3"
            value={openingText}
            onChange={(e) => setOpeningText(e.target.value)}
            required
            
          />
        </label>
        <label>
          Release Date
          <input
            type="text"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
        
          />
        </label>
        <br/>
        <div>
            <button type="submit">Add Movie</button>
        </div>
      </form>
    </section>
  );
};

export default MoviesForm;
