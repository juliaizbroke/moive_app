"use client";

import { useRef, useState, useEffect } from "react";
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
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
  
    const updateArrowVisibility = () => {
      if (!carouselRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };
  
    useEffect(() => {
      const carousel = carouselRef.current;
      if (carousel) {
        carousel.addEventListener('scroll', updateArrowVisibility);
        // Initial check
        updateArrowVisibility();
      }
      return () => {
        if (carousel) {
          carousel.removeEventListener('scroll', updateArrowVisibility);
        }
      };
    }, []);
  
    const scroll = (direction: 'left' | 'right') => {
      if (!carouselRef.current) return;
      
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    };
  
    return (
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
  
        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto px-4 pb-4 pt-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group relative"
            >
              <div 
                onClick={() => router.push(`/home/${movie.id}`)}
                className="flex-shrink-0 w-48 bg-card rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:z-10 hover:scale-110"
              >
                <div className="aspect-[2/3] relative">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-center bg-card">
                  <h3 className="text-md font-semibold line-clamp-1">{movie.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(movie.release_date).getFullYear()}</p>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"/>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    );
};
