"use client";

import Image from "next/image";
import React from "react";

interface CastMember {
  cast_id?: number;
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

export default function CastList({
  cast,
  onSelect,
}: {
  cast: CastMember[];
  onSelect: (personId: number, name: string) => void;
}) {
  if (!cast || cast.length === 0) return <p className="p-4">No cast information available.</p>;

  return (
    <div className="py-6">
      <h3 className="text-2xl font-semibold mb-3 ml-4">Cast</h3>
      <div className="flex space-x-4 overflow-x-auto px-4">
        {cast.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelect(member.id, member.name)}
            className="flex-shrink-0 w-36 bg-base-100 rounded-lg shadow-md overflow-hidden text-left hover:scale-105 transform transition-transform duration-200"
            aria-label={`See movies with ${member.name}`}>
            {member.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                width={185}
                height={278}
                alt={member.name}
                className="w-full h-44 object-cover"
              />
            ) : (
              <div className="w-full h-44 bg-gray-200 flex items-center justify-center">No Image</div>
            )}
            <div className="p-2">
              <p className="font-medium truncate">{member.name}</p>
              <p className="text-xs text-gray-500 truncate">{member.character}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
