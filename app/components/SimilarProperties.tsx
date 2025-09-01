"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/app/api/apiService'; // Corrected path to apiService

// Define the shape of the property data we expect from the API
interface PropertySummary {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  image: string;
}

interface SimilarPropertiesProps {
  propertyId: string;
}

// This interface defines the expected structure of the API response object
interface ApiResponse {
  success: boolean;
  data: PropertySummary[];
  message?: string;
}

export default function SimilarProperties({ propertyId }: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!propertyId) return;
      
      try {
        setLoading(true);
        // The API service returns the entire response object in `response.data`
        const response = await api.get<ApiResponse>(`/properties/${propertyId}/similar`, {
          params: { limit: 5 }
        });

        // --- FIX IS HERE ---
        // We need to access the nested 'data' property which contains the array.
        // Also, we check if it's actually an array before trying to use it.
        if (response.data && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          // Handle cases where the API response format is unexpected
          console.error("API response for similar properties is not an array:", response.data);
          setProperties([]); // Set to empty array to avoid crash
        }

      } catch (err) {
        console.error("Failed to fetch similar properties:", err);
        setError("Could not load similar listings at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [propertyId]);

  // Handle loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-200 h-80 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // This logic remains the same
  const placeholdersNeeded = 5 - properties.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {/* Render fetched property cards */}
      {properties.map((prop) => (
        <Link href={`/all/property/${prop.id}`} key={prop.id} className="group">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="relative h-48">
              <img src={prop.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'} alt={prop.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col">
              <h3 className="text-lg font-semibold text-[#083A85] truncate group-hover:text-[#F20C8F] transition-colors">
                {prop.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 truncate">{prop.location}</p>
              <p className="mt-auto text-lg font-bold text-[#F20C8F]">
                ${prop.pricePerNight}<span className="text-sm font-normal text-gray-500"> / night</span>
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* Render placeholder cards if needed */}
      {placeholdersNeeded > 0 && Array.from({ length: placeholdersNeeded }).map((_, i) => (
        <div key={`placeholder-${i}`} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-full min-h-[20rem]">
          <p className="text-center text-gray-500 font-medium px-4">
            No more properties available.
          </p>
        </div>
      ))}
    </div>
  );
}
