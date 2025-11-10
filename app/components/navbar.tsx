"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '../context/FavoritesContext';
import Link from 'next/link';

const TMDB_BEARER = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjc5OGM1NzkxNGFmODA2N2M0OGM5OGJkYzA1Mzk5NiIsIm5iZiI6MTcyOTgzMTgyNC45NDIwMDAyLCJzdWIiOiI2NzFiMjM5MGU4MzNkOTJlZjA2MDAxN2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.j8rGZqQoL9zPunJ_LFdLSxkTFmGOgakyNImMovDSKGE`;

interface SearchResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
        {
          headers: {
            accept: "application/json",
            Authorization: TMDB_BEARER,
          },
        }
      );
      const data = await response.json();
      setSearchResults(data.results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleMovieSelect = (movieId: number) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/home/${movieId}`);
  };

  return (
    <div className="navbar bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/40">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/home">Home</Link></li>
            <li><Link href="/favorites">Favorites</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="navbar-center">
        <Link href="/home" className="btn btn-ghost text-xl">Movies</Link>
      </div>
      
      <div className="navbar-end">
        <div className="relative">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-base-100 rounded-lg shadow-xl p-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full"
              />
              
              {searchResults.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {searchResults.map((result) => (
                    <li 
                      key={result.id}
                      onClick={() => handleMovieSelect(result.id)}
                      className="p-2 hover:bg-base-200 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <p className="font-medium">{result.title}</p>
                          <p className="text-sm text-gray-500">
                            {result.release_date?.split('-')[0]}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <Link href="/favorites" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6"
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
              />
            </svg>
            {favorites.length > 0 && (
              <span className="badge badge-xs badge-primary indicator-item">{favorites.length}</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;