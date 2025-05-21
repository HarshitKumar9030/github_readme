'use client';

import React from 'react';
import FeaturesPage from '@/components/FeaturesPage';
import Navbar from '@/components/Navbar';

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <FeaturesPage />
      </main>
    </div>
  );
}
