import { useEffect, useState } from "react";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const KEY = "d14a910e";

  useEffect(
    function () {
      callback?.();
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
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
