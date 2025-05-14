"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieCard from "@/app/components/movie_card";
import { MovieData } from "@/app/types/movieTypes";

const MovieDetailPage = () => {
  const params = useParams();
  const movie_id = params.movie_id; // ✅ Ensure it matches folder name

  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie_id}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjc5OGM1NzkxNGFmODA2N2M0OGM5OGJkYzA1Mzk5NiIsIm5iZiI6MTcyOTgzMTgyNC45NDIwMDAyLCJzdWIiOiI2NzFiMjM5MGU4MzNkOTJlZjA2MDAxN2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.j8rGZqQoL9zPunJ_LFdLSxkTFmGOgakyNImMovDSKGE`,
            },
          }
        );
        const movieData: MovieData = await response.json();
        setMovie(movieData);
        setLoading(false); 
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    if (movie_id) {
      fetchData();
    }
  }, [movie_id]);

  if (loading) return <span className="loading loading-ring loading-lg place-content-center"></span>; 
  if (!movie) return <p>Movie not found.</p>; 

  return (
    <div>
      <MovieCard movie={movie} />
    </div>
  );
};

export default MovieDetailPage;
