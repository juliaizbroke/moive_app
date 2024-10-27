"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/navbar";

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
  const [data, setData] = useState<MovieData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer YOUR_ACCESS_TOKEN`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result.results);
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
      <div className="bg-base-200 min-h-screen ">
        <h3 className="text-2xl font-bold mb-6  ml-20 pt-10 ">Popular Movies</h3>
        <Carousel movies={data} />
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}

const Carousel = ({ movies }: { movies: MovieData[] }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -750, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 750, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
        aria-label="Scroll Left"
      >
        ◀
      </button>

      {/* Carousel Content */}
      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto px-4 scrollbar-hide"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 w-48 bg-base-100 rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-md font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-500">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
        aria-label="Scroll Right"
      >
        ▶
      </button>
    </div>
  );
};
