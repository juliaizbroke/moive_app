"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Carousel from "@/app/components/carousel";
// Define the expected structure of your data
interface MovieData {
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const TMDB_BEARER = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjc5OGM1NzkxNGFmODA2N2M0OGM5OGJkYzA1Mzk5NiIsIm5iZiI6MTcyOTgzMTgyNC45NDIwMDAyLCJzdWIiOiI2NzFiMjM5MGU4MzNkOTJlZjA2MDAxN2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.j8rGZqQoL9zPunJ_LFdLSxkTFmGOgakyNImMovDSKGE`;

interface MovieSection {
  title: string;
  endpoint: string;
  movies: MovieData[];
}

export default function Home() {
  const [sections, setSections] = useState<MovieSection[]>([
    { title: "Now Playing", endpoint: "now_playing", movies: [] },
    { title: "Popular Movies", endpoint: "popular", movies: [] },
    { title: "Top Rated", endpoint: "top_rated", movies: [] },
    { title: "Upcoming", endpoint: "upcoming", movies: [] },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = sections.map(section =>
          fetch(`https://api.themoviedb.org/3/movie/${section.endpoint}`, {
            headers: {
              accept: "application/json",
              Authorization: TMDB_BEARER,
            },
          }).then(res => res.json())
        );

        const responses = await Promise.all(fetchPromises);
        
        setSections(sections => sections.map((section, i) => ({
          ...section,
          movies: responses[i].results || []
        })));
      } catch (error) {
        setError("Error fetching data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-8 py-8">
          {sections.map((section) => (
            <section key={section.endpoint} className="pb-4">
              <div className="max-w-[1400px] mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                <Carousel movies={section.movies} />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
