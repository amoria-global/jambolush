// In your Home component file (e.g., app/pages/home.tsx)

"use client";

import { useState } from 'react';
import Hero from './components/home/hero';
import HouseCard from './components/home/houseCard';
import api from '@/app/api/apiService';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ADDED: A new state to track if a search has been performed.
  const [hasSearched, setHasSearched] = useState(false);

  // This function is the "engine" that calls your backend API.
  const handleSearch = async (filters: any) => {
    // ADDED: Set that a search has started.
    setHasSearched(true);
    setIsLoading(true);
    setError('');
    setProperties([]); // Clear previous results

    try {
      const response = await api.get('/properties/search', { params: filters });
      setProperties(response.data.data.properties);
    } catch (err: any)      {
      setError(err.message || 'Failed to fetch properties.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Hero onSearch={handleSearch} />

      {/* UPDATED: This section now handles the "no results" case. */}
      <div className="container mx-auto p-4">
        {isLoading && <p className="text-center text-lg mt-8">Loading properties...</p>}
        
        {error && <p className="text-center text-red-500 mt-8">{error}</p>}
        
        {/* This logic now checks if a search has happened before deciding what to show. */}
        {hasSearched && !isLoading && !error && (
          <>
            {properties.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Search Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {properties.map((prop: any) => (
                    <HouseCard key={prop.id} house={prop} />
                  ))}
                </div>
              </div>
            ) : (
              // This is the new message for when no properties are found.
              <div className="mt-8 text-center bg-gray-50 rounded-xl py-20 px-10">
              <p className="text-xl font-semibold text-gray-700">No Properties Found</p>
              <p className="mt-2 text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
            </div>
            )}
          </>
        )}
      </div>
    </>
  );
}