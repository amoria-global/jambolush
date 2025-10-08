//app/pages/home.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import Hero from "../components/home/hero";
import HouseCard from "../components/home/houseCard";
import { api } from "../api/api-conn";
import { encodeId } from "../utils/encoder";
import Link from 'next/link';

interface Property {
  id: number;
  name: string;
  location: string;
  category: string;
  type?: string;
  pricePerNight: number;
  image?: string;
  rating?: number;
  reviewsCount?: number;
  beds: number;
  baths: number;
  hostName?: string;
  availability?: string;
}

interface HouseCardProperty {
  id: number;
  image: string;
  category: string;
  type?: string;
  title: string;
  pricePerNight: string;
  location: string;
  beds: number;
  baths: number;
  rating?: number;
  reviews?: number;
  hostName?: string;
  availability?: string;
}

interface Tour {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  duration: string;
  category: string;
}

// TourCard Component
const TourCard = ({ tour }: { tour: Tour }) => {
  const encodedId = tour.id ? encodeId(tour.id.toString()) : '';

  return (
    <Link href={`/tours/${encodedId}`} className="block rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100">
      <div
        className="relative h-40 bg-cover bg-center bg-gray-200"
        style={{ backgroundImage: `url(${tour.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        <div className="absolute bottom-1.5 left-1.5">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-1.5 py-0.5 rounded-md text-xs font-bold shadow-lg">
            ${tour.price}/person
          </span>
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#083A85] to-[#0B4A9F] p-3 text-white h-full">
        <div className="flex items-center mb-1.5">
          <span className="text-sm font-bold">{tour.rating}</span>
          <span className="text-sm text-blue-100 ml-1">({tour.reviews})</span>
        </div>
        <h3 className="text-xs font-bold mb-1.5 text-white group-hover:text-blue-100 transition-colors leading-tight line-clamp-2">
          {tour.title}
        </h3>
        <div className="flex items-center mb-2 text-xs text-blue-100">
          <i className="bi bi-geo-alt-fill mr-0.5 text-xs"></i>
          <p className="truncate">{tour.location}</p>
        </div>
        <div className="flex justify-between items-center text-[10px] text-blue-100">
          <span className="truncate">{tour.duration}</span>
          <span className="text-green-300">Available</span>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const [spaces, setSpaces] = useState<HouseCardProperty[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const transformProperty = useCallback((backendProperty: Property): HouseCardProperty => {
    return {
      id: backendProperty.id,
      title: backendProperty.name,
      image: backendProperty.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      category: backendProperty.category.charAt(0).toUpperCase() + backendProperty.category.slice(1).toLowerCase(),
      type: backendProperty.type || 'N/A',
      pricePerNight: `$${backendProperty.pricePerNight}`,
      location: backendProperty.location,
      beds: backendProperty.beds,
      baths: backendProperty.baths,
      rating: backendProperty.rating || 0,
      reviews: backendProperty.reviewsCount || 0,
      hostName: backendProperty.hostName,
      availability: backendProperty.availability
    };
  }, []);

  const transformTour = useCallback((backendTour: any): Tour => {
    return {
      id: backendTour.id?.toString() || backendTour._id?.toString() || '',
      title: backendTour.title || 'Untitled Tour',
      image: backendTour.image || `https://images.unsplash.com/photo-1464822759844-d150f39cbae2?w=400&h=300&fit=crop&q=80`,
      price: backendTour.price || 0,
      rating: backendTour.rating || 4.5,
      reviews: backendTour.reviews || backendTour.totalReviews || 0,
      location: `${backendTour.locationCity || 'Unknown'}, ${backendTour.locationCountry || 'Unknown'}`,
      duration: backendTour.duration ? `${Math.floor(backendTour.duration / 24)} days` : '1 day',
      category: backendTour.category || 'Adventure'
    };
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch spaces from /properties/search
      const spacesResponse: any = await api.get('/properties/search', {
        page: 1,
        limit: 6
      });

      // Fetch tours from /tours/search
      const toursResponse: any = await api.get('/tours/search', {
        page: 1,
        limit: 6
      });

      if (!spacesResponse.success && !toursResponse.success) {
        throw new Error('Failed to fetch properties and tours');
      }

      // Process spaces
      if (spacesResponse.success) {
        const spacesData: any = spacesResponse.data?.data || spacesResponse.data || {};
        const { properties = [] } = spacesData;
        const transformedSpaces = properties.map(transformProperty);
        setSpaces(transformedSpaces);
      }

      // Process tours
      if (toursResponse.success) {
        const toursData: any = toursResponse.data?.data || toursResponse.data || {};
        const tours = toursData.tours || toursData.properties || [];
        const transformedTours = tours.map(transformTour);
        setTours(transformedTours);
      }

    } catch (err: any) {
      console.error('Failed to fetch properties:', err);
      const errorMessage = err?.message || 'Failed to load properties';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [transformProperty, transformTour]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const retryFetch = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleHeroSearch = useCallback((searchData: any) => {
    console.log('Search triggered from Hero:', searchData);
    // You can add additional search handling here if needed
  }, []);

  return (
    <div>
      <Hero onSearch={handleHeroSearch} />

      <div className="listings-container px-4 sm:px-6 lg:px-8 py-12 max-w-[1600px] mx-auto">
        {/* Error Message */}
        {error && !loading && spaces.length === 0 && (
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-5 max-w-md mx-auto">
              <div className="text-red-600 text-base font-medium mb-1.5">
                Unable to load properties
              </div>
              <p className="text-red-500 text-sm mb-3">{error}</p>
              <button
                onClick={retryFetch}
                className="bg-red-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-32 rounded-t-lg"></div>
                <div className="bg-gray-100 p-2.5 rounded-b-lg">
                  <div className="bg-gray-300 h-3 rounded mb-1.5"></div>
                  <div className="bg-gray-300 h-2.5 rounded mb-1.5"></div>
                  <div className="bg-gray-300 h-2.5 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Spaces Section */}
        {!loading && spaces.length > 0 && (
          <>
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Spaces</h2>
                <a
                  href="/spaces"
                  className="text-[#083A85] hover:text-[#06316f] text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  See All
                  <i className="bi bi-arrow-right text-xs"></i>
                </a>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
                {spaces.map((space) => (
                  <HouseCard key={space.id} house={space} />
                ))}
              </div>
            </div>

            {/* Tours Section */}
            {tours.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Tours</h2>
                  <a
                    href="/tours"
                    className="text-[#083A85] hover:text-[#06316f] text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    See All
                    <i className="bi bi-arrow-right text-xs"></i>
                  </a>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && spaces.length === 0 && !error && (
          <div className="text-center py-10">
            <div className="text-gray-500 text-base mb-3">
              No properties found
            </div>
            <p className="text-gray-400 text-sm mb-5">
              No properties available at the moment
            </p>
            <button
              onClick={retryFetch}
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
