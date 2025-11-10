import Image from "next/image";
import { MovieData } from "@/app/types/movieTypes";
import { useFavorites } from "@/app/context/FavoritesContext";

export default function MovieCard({ movie }: { movie: MovieData }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);
  return (
    <div className="bg-gradient-to-r from-background via-card to-background py-8">
      <div className="max-w-6xl mx-auto rounded-lg shadow-xl overflow-hidden p-6 flex flex-col lg:flex-row gap-6 items-start bg-card/50">
        <div className="flex-shrink-0 rounded overflow-hidden transform transition-transform duration-300 hover:scale-105">
          <Image
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/favicon.ico"}
            alt={movie.title}
            width={350}
            height={525}
            className="object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-extrabold">{movie.title}</h1>
            <button
              onClick={() => isMovieFavorite ? removeFavorite(movie.id) : addFavorite(movie)}
              className={`btn btn-circle ${isMovieFavorite ? 'btn-error hover:btn-error' : 'btn-ghost'} transition-all duration-300`}
              aria-label={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill={isMovieFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={isMovieFavorite ? "0" : "2"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {movie.release_date} • {movie.runtime ? `${movie.runtime} min` : ""}
            {movie.genres?.length > 0 && ` • ${movie.genres.map(g => g.name).join(", ")}`}
          </p>
          {movie.tagline && (
            <p className="text-lg italic text-gray-600 mb-4">{movie.tagline}</p>
          )}
          <p className="text-gray-700 leading-relaxed mb-4">{movie.overview}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge badge-lg badge-primary gap-1">
              <span className="text-yellow-400">★</span> 
              {movie.vote_average.toFixed(1)}
            </span>
            {movie.homepage && (
              <a 
                href={movie.homepage} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-outline btn-sm"
              >
                Visit Site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
