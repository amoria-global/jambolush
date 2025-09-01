//app/pages/home.tsx
"use client";
import { useState, useEffect } from 'react';
import Hero from "../components/home/hero";
import HouseCard from "../components/home/houseCard";
import api, { Property, BackendResponse, PropertiesResponse } from "../api/apiService";

interface SearchFilters {
  type: string;
  location: string;
  keyword: string;
}

// Transform backend property to match HouseCard expectations
interface HouseCardProperty {
  id: number;
  image: string;
  category: string;
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

const Home = () => {
  const [houses, setHouses] = useState<HouseCardProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: 'all',
    location: '',
    keyword: ''
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch properties when search filters change
  useEffect(() => {
    if (searchFilters.location || searchFilters.keyword || searchFilters.type !== 'all') {
      handleSearch();
    }
  }, [searchFilters]);

  // Transform backend property to frontend format
  const transformProperty = (backendProperty: Property): HouseCardProperty => {
    return {
      id: backendProperty.id,
      title: backendProperty.name, // Map name to title
      image: backendProperty.image || getDefaultImage(),
      category: capitalizeFirstLetter(backendProperty.category),
      pricePerNight: `$${backendProperty.pricePerNight}`, // Format price
      location: backendProperty.location,
      beds: backendProperty.beds,
      baths: backendProperty.baths,
      rating: backendProperty.rating,
      reviews: backendProperty.reviewsCount, // Map reviewsCount to reviews
      hostName: backendProperty.hostName,
      availability: backendProperty.availability
    };
  };

  const fetchProperties = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getProperties({
        page,
        limit: 20,
      });

      // Handle backend response structure
      if (response.data.success) {
        const { properties, total, totalPages } = response.data.data;
        const transformedProperties = properties.map(transformProperty);
        
        if (append) {
          setHouses(prev => [...prev, ...transformedProperties]);
        } else {
          setHouses(transformedProperties);
        }
        
        setTotalCount(total);
        setCurrentPage(page);
        setHasMore(page < totalPages);
      } else {
        throw new Error(response.data.message || 'Failed to fetch properties');
      }
      
    } catch (err: any) {
      console.error('Failed to fetch properties:', err);
      setError(err?.message || 'Failed to load properties');
      
      // If it's the initial load and fails, show fallback data
      if (!append && houses.length === 0) {
        setHouses(getFallbackData());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.searchProperties(
        searchFilters.keyword || undefined,
        searchFilters.location || undefined,
        searchFilters.type !== 'all' ? searchFilters.type : undefined
      );

      if (response.data.success) {
        const { properties, total } = response.data.data;
        const transformedProperties = properties.map(transformProperty);
        
        setHouses(transformedProperties);
        setTotalCount(total);
        setCurrentPage(1);
        setHasMore(false); // Search results don't support pagination in this implementation
      } else {
        throw new Error(response.data.message || 'Search failed');
      }
      
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err?.message || 'Search failed');
      // Keep existing results on search failure
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProperties(currentPage + 1, true);
    }
  };

  const clearSearch = () => {
    setSearchFilters({ type: 'all', location: '', keyword: '' });
    fetchProperties();
  };

  const getDefaultImage = (): string => {
    return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
  };

  const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Fallback data in case API fails (optional)
  const getFallbackData = (): HouseCardProperty[] => [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      category: "Villa",
      title: "Modern Villa with Pool",
      pricePerNight: "$120",
      location: "Beverly Hills, CA",
      beds: 4,
      baths: 3,
      rating: 4.9,
      reviews: 127,
      hostName: "Sarah M.",
      availability: "Available"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      category: "Apartment",
      title: "Downtown Luxury Apartment",
      pricePerNight: "$89",
      location: "Manhattan, NY",
      beds: 2,
      baths: 2,
      rating: 4.7,
      reviews: 89,
      hostName: "Michael K.",
      availability: "Available"
    },
    // Add more fallback items as needed...
  ];

  // Handle search from Hero component
  const handleHeroSearch = (searchData: SearchFilters) => {
    setSearchFilters(searchData);
  };

  return (
    <div>
      <Hero onSearch={handleHeroSearch} />
      
      <div className="listings-container px-4 sm:px-6 lg:px-8 py-12 max-w-[1600px] mx-auto">
        {/* Search Results Info */}
        {(searchFilters.location || searchFilters.keyword || searchFilters.type !== 'all') && (
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div className="text-gray-600">
              <span className="text-lg font-medium">
                {totalCount} properties found
              </span>
              {(searchFilters.location || searchFilters.keyword) && (
                <span className="ml-2">
                  for "{searchFilters.keyword || searchFilters.location}"
                </span>
              )}
            </div>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && houses.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 text-lg font-medium mb-2">
                Unable to load properties
              </div>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchProperties()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && houses.length === 0 && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-40 rounded-t-xl"></div>
                <div className="bg-gray-100 p-3 rounded-b-xl">
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Properties Grid */}
        {houses.length > 0 && (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
              {houses.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-[#083A85] cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-[#083A85] transition-colors font-medium"
                >
                  Load More Properties
                </button>
              </div>
            )}

            {/* Loading More */}
            {loading && houses.length > 0 && (
              <div className="text-center mt-8">
                <div className="inline-flex items-center text-gray-500">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more properties...
                </div>
              </div>
            )}

            {/* End of results */}
            {!hasMore && houses.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                You've seen all {totalCount} properties
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && houses.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No properties found
            </div>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria
            </p>
            <button
              onClick={clearSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;