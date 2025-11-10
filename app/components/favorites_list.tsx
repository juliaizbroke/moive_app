"use client";

import React from "react";
import Image from "next/image";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useRouter } from "next/navigation";

export default function FavoritesList() {
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();

  if (!favorites || favorites.length === 0)
    return <p className="p-4">You have no favorites yet.</p>;

  return (
    <div className="py-6">
      <h3 className="text-2xl font-semibold mb-3 ml-4">Your Favorites</h3>
      <div className="flex space-x-4 overflow-x-auto px-4">
        {favorites.map((m) => (
          <div key={m.id} className="flex-shrink-0 w-40 bg-base-100 rounded-lg shadow cursor-pointer">
            <div onClick={() => router.push(`/home/${m.id}`)}>
              <Image
                src={m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : "/favicon.ico"}
                width={200}
                height={300}
                alt={m.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-2">
                <p className="font-medium truncate">{m.title}</p>
                <p className="text-xs text-gray-500 truncate">{m.release_date}</p>
              </div>
            </div>
            <div className="p-2">
              <button className="btn btn-sm btn-outline btn-block" onClick={() => removeFavorite(m.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
