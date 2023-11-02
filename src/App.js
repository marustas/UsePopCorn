import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const SearchBar = ({ query, setQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const NavBar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
};

const MovieList = ({ movies, onSelectMovie }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
};

const Movie = ({ movie, onSelectMovie }) => {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

const WatchedMovieList = ({ watched, onDeleteWatchedMovie }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
};

const WatchedMovie = ({ movie, onDeleteWatchedMovie }) => {
  const { imdbID, title, imdbRating, userRating, runtime, poster } = movie;
  return (
    <li key={imdbID}>
      <img src={poster} alt={`${title} poster`} />
      <h3>{title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatchedMovie(imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
};

const WatchedSummary = ({ watched }) => {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(1);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(0);

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const Error = ({ message }) => {
  return <p className="error">{message}</p>;
};

const SelectedMovie = ({ selectedId, onCloseMovie, onAddWatched, watched }) => {
  const [movie, setMovie] = useState({});
  const [isMovieLoaded, setIsMovieLoaded] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedMovieUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    Year: year,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  useEffect(
    function () {
      document.title = `MOVIE | ${title}`;

      return function () {
        document.title = "UsePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(event) {
        if (event.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsMovieLoaded(false);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsMovieLoaded(true);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isMovieLoaded ? (
        <>
          <header>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️ {imdbRating} iMDb rating</span>
              </p>
            </div>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={23}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedMovieUserRating} <span>🌟</span>{" "}
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>
              <strong>Starring</strong> {actors}
            </p>
            <p>
              <strong>Directed by</strong> {director}
            </p>
          </section>{" "}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
const KEY = "d14a910e";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    //Alternative to useEffect but doesn't automatically get removed from local storage
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleSetQuery(query) {
    setQuery(query);

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Ooops. Something went wrong.");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.message !== "AbortError") {
          setError(error.message);
        }
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={handleSetQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/*
        <Box element={<MovieList movies={movies} />} />
        This is the same as the line below:  
        */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectedMovie} movies={movies} />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              onAddWatched={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return <p className="loader">Loading...</p>;
};
