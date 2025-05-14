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

export default function Home() {
  const [popular, setPopular] = useState<MovieData[]>([]);
  const [toprated, setToprated] = useState<MovieData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popResponse, topResponse] = await Promise.all ([fetch(
          "https://api.themoviedb.org/3/movie/popular",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjc5OGM1NzkxNGFmODA2N2M0OGM5OGJkYzA1Mzk5NiIsIm5iZiI6MTcyOTgzMTgyNC45NDIwMDAyLCJzdWIiOiI2NzFiMjM5MGU4MzNkOTJlZjA2MDAxN2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.j8rGZqQoL9zPunJ_LFdLSxkTFmGOgakyNImMovDSKGE`,
            },
          }
        ). then(res => res.json()), 
        fetch("https://api.themoviedb.org/3/movie/top_rated",{
          headers: {
            accept: "application/json", 
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjc5OGM1NzkxNGFmODA2N2M0OGM5OGJkYzA1Mzk5NiIsIm5iZiI6MTcyOTgzMTgyNC45NDIwMDAyLCJzdWIiOiI2NzFiMjM5MGU4MzNkOTJlZjA2MDAxN2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.j8rGZqQoL9zPunJ_LFdLSxkTFmGOgakyNImMovDSKGE`,
          },
        }
      ).then(res => res.json())]);

        setPopular(popResponse.results);
        setToprated(topResponse.results);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="bg-base-200 pt-10">
        <h3 className="text-2xl font-bold mb-6  ml-20 pt-5">Popular Movies</h3>
        <Carousel movies={popular} />
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
      <div className="bg-base-200 pt-10">
        <h3 className="text-2xl font-bold mb-6  ml-20 pt-5">Top Rated</h3>
        <Carousel movies={toprated} />
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
