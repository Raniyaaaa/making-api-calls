import React, { useState } from "react";

const MoviesForm = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [openingText, setOpeningText] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const addMovieHandler = (event) => {
    event.preventDefault();
    const newMovie = {
      title,
      openingText,
      releaseDate,
    };

    setMovies((prevMovies) => [...prevMovies, newMovie]);
    console.log("New Movie Object:", movies);

    setTitle('');
    setOpeningText('');
    setReleaseDate('');
  };

  return (
    <section>
      <form onSubmit={addMovieHandler}>
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
        <button type="submit">Add Movie</button>
      </form>
    </section>
  );
};

export default MoviesForm;
