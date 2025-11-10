"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface MovieBrief {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string;
}

export default function RelatedMovies({ movies }: { movies: MovieBrief[] }) {
  const router = useRouter();

  if (!movies || movies.length === 0) return <p className="p-4">No related movies found.</p>;

  return (
    <div className="py-6">
      <h3 className="text-2xl font-semibold mb-3 ml-4">More from this cast</h3>
      <div className="flex space-x-4 overflow-x-auto px-4">
        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => router.push(`/home/${m.id}`)}
            className="flex-shrink-0 w-40 bg-base-100 rounded-lg shadow hover:scale-105 transform transition-transform duration-200 cursor-pointer"
          >
            {m.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                width={200}
                height={300}
                alt={m.title}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center">No Image</div>
            )}
            <div className="p-2">
              <p className="font-medium truncate">{m.title}</p>
              <p className="text-xs text-gray-500 truncate">{m.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
