"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function Carousel({ movies }: { movies: MovieData[] }) {
    const router = useRouter();
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
            onClick={() => router.push(`/home/${movie.id}`)}
              key={movie.id}
              className="flex-shrink-0 w-48 bg-base-100 rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
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
