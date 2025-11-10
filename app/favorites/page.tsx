"use client";

import React from 'react';
import Navbar from '@/app/components/navbar';
import FavoritesList from '@/app/components/favorites_list';

export default function FavoritesPage() {
  return (
    <div>
      <Navbar />
      <FavoritesList />
    </div>
  );
}