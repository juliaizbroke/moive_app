"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieCard from "@/app/components/movie_card";
import { MovieData } from "@/app/types/movieTypes";
import Navbar from "@/app/components/navbar";
import CastList from "@/app/components/cast_list";
import RelatedMovies from "@/app/components/related_movies";

const TMDB_BEARER = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjc5OGM1NzkxNGFmODA2N2M0OGM5OGJkYzA1Mzk5NiIsIm5iZiI6MTcyOTgzMTgyNC45NDIwMDAyLCJzdWIiOiI2NzFiMjM5MGU4MzNkOTJlZjA2MDAxN2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.j8rGZqQoL9zPunJ_LFdLSxkTFmGOgakyNImMovDSKGE`;

interface Cast {
  cast_id: number;
  character: string;
  credit_id: string;
  id: number;
  name: string;
  profile_path: string | null;
}

interface MovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  popularity: number;
}

const MovieDetailPage = () => {
  const params = useParams();
  const movie_id = params.movie_id;

  const [movie, setMovie] = useState<MovieData | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [selectedCastMovies, setSelectedCastMovies] = useState<MovieCredit[] | null>(null);
  const [selectedCastName, setSelectedCastName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [castLoading, setCastLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!movie_id) return;
      
      setLoading(true);
      try {
        const [movieRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movie_id}`, {
            headers: { accept: "application/json", Authorization: TMDB_BEARER },
          }).then(r => r.json()),
          fetch(`https://api.themoviedb.org/3/movie/${movie_id}/credits`, {
            headers: { accept: "application/json", Authorization: TMDB_BEARER },
          }).then(r => r.json()),
        ]);

        setMovie(movieRes);
        setCast(creditsRes.cast || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movie_id]);

  const handleCastSelect = async (castId: number, name: string) => {
    setCastLoading(true);
    setSelectedCastName(name);
    setSelectedCastMovies(null);
    
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${castId}/movie_credits`,
        {
          headers: {
            accept: "application/json",
            Authorization: TMDB_BEARER,
          },
        }
      );
      const data = await res.json();
      // Filter out the current movie and sort by popularity
      const otherMovies = (data.cast as MovieCredit[] || [])
        .filter((m) => m.id !== Number(movie_id))
        .sort((a, b) => b.popularity - a.popularity);
      
      setSelectedCastMovies(otherMovies.slice(0, 20));
    } catch (error) {
      console.error("Error fetching cast movies:", error);
      setSelectedCastMovies([]);
    } finally {
      setCastLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-lg">Movie not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="space-y-8">
        <MovieCard movie={movie} />
        
        <div className="max-w-6xl mx-auto px-4">
          <CastList cast={cast} onSelect={handleCastSelect} />
          
          {selectedCastName && (
            <div className="my-8">
              <h3 className="text-2xl font-semibold mb-4">
                Movies featuring {selectedCastName}
              </h3>
              {castLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : selectedCastMovies && selectedCastMovies.length > 0 ? (
                <RelatedMovies movies={selectedCastMovies} />
              ) : (
                <p className="text-gray-500">No other movies found for this cast member.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
