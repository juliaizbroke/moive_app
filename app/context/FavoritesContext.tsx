"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { MovieData } from "@/app/types/movieTypes";

type FavoritesContextValue = {
  favorites: MovieData[];
  addFavorite: (movie: MovieData) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<MovieData[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favorites_v1");
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to read favorites from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("favorites_v1", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to write favorites to localStorage:", e);
    }
  }, [favorites]);

  const addFavorite = (movie: MovieData) => {
    setFavorites((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isFavorite = (movieId: number) => favorites.some((m) => m.id === movieId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
