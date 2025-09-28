//app/pages/home.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import Hero from "../components/home/hero";
import HouseCard from "../components/home/houseCard";
import { api } from "../api/api-conn";

interface SearchFilters {
  type: string;
  location: string;
  keyword: string;
}

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

interface PropertiesData {
  properties: Property[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
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
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  // Transform backend property to frontend format
  const transformProperty = useCallback((backendProperty: Property): HouseCardProperty => {
    return {
      id: backendProperty.id,
      title: backendProperty.name,
      image: backendProperty.image || getDefaultImage(),
      category: capitalizeFirstLetter(backendProperty.category),
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

  // Unified function to fetch properties with proper error handling
  const fetchProperties = useCallback(async (
    page: number = 1, 
    append: boolean = false,
    filters?: SearchFilters
  ) => {
    try {
      setLoading(true);
      setError(null);

      let response: any;
      const isFiltered = filters && (
        filters.location || 
        filters.keyword || 
        (filters.type !== 'all' && filters.type !== '')
      );

      if (isFiltered) {
        // Use search endpoint with filters
        // API expects: /properties/search?keyword=...&location=...&category=...&page=1&limit=12
        const params: Record<string, string | number> = {
          page: page,
          limit: 12
        };
        
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.location) params.location = filters.location;
        if (filters.type !== 'all') params.category = filters.type;

        console.log('Fetching with filters:', params);
        response = await api.get<PropertiesData>('/properties/search', params);
      } else {
        // Use regular properties endpoint
        // API expects: /properties/search?page=1&limit=12
        console.log('Fetching all properties, page:', page);
        response = await api.get<PropertiesData>('/properties/search', {
          page: page,
          limit: 12
        });
      }

      console.log('API Response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch properties');
      }

      // Handle different response structures
      let propertiesData: PropertiesData | any;
      propertiesData = response.data?.data;

      const { properties = [], total = 0, totalPages = 1 } = propertiesData;
      const transformedProperties = properties.map(transformProperty);
      
      if (append) {
        setHouses(prev => [...prev, ...transformedProperties]);
      } else {
        setHouses(transformedProperties);
      }
      
      setTotalCount(total || transformedProperties.length);
      setCurrentPage(page);
      setHasMore(page < (totalPages || 1) && transformedProperties.length > 0);
      setIsSearchActive(!!isFiltered);
      
    } catch (err: any) {
      console.error('Failed to fetch properties:', err);
      const errorMessage = err?.message || 'Failed to load properties';
      setError(errorMessage);
      
      // If it's the initial load and fails, show fallback data
      if (!append && houses.length === 0) {
        setHouses(getFallbackData());
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [transformProperty, houses.length]);

  // Initial load
  useEffect(() => {
    fetchProperties(1, false);
  }, []);

  // Handle search filters change
  useEffect(() => {
    const isFiltered = searchFilters.location || 
                      searchFilters.keyword || 
                      (searchFilters.type !== 'all' && searchFilters.type !== '');
    
    if (isFiltered) {
      // Reset pagination and fetch with filters
      fetchProperties(1, false, searchFilters);
    }
  }, [searchFilters, fetchProperties]);

  // Load more properties
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const filters = isSearchActive ? searchFilters : undefined;
      fetchProperties(currentPage + 1, true, filters);
    }
  }, [hasMore, loading, currentPage, isSearchActive, searchFilters, fetchProperties]);

  // Clear search and reset to all properties
  const clearSearch = useCallback(() => {
    setSearchFilters({ type: 'all', location: '', keyword: '' });
    setIsSearchActive(false);
    fetchProperties(1, false);
  }, [fetchProperties]);

  // Retry fetching on error
  const retryFetch = useCallback(() => {
    const filters = isSearchActive ? searchFilters : undefined;
    fetchProperties(1, false, filters);
  }, [isSearchActive, searchFilters, fetchProperties]);

  // Handle search from Hero component
  const handleHeroSearch = useCallback((searchData: SearchFilters) => {
    setSearchFilters(searchData);
  }, []);

  // Utility functions
  const getDefaultImage = (): string => {
    return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
  };

  const capitalizeFirstLetter = (string: string): string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Fallback data for when API fails
  const getFallbackData = (): HouseCardProperty[] => [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      category: "Villa",
      title: "Modern Villa with Pool",
      type: "villa",
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
      type: "apartment",
      pricePerNight: "$89",
      location: "Manhattan, NY",
      beds: 2,
      baths: 2,
      rating: 4.7,
      reviews: 89,
      hostName: "Michael K.",
      availability: "Available"
    }
  ];

  return (
    <div>
      <Hero onSearch={handleHeroSearch} />
      
      <div className="listings-container px-4 sm:px-6 lg:px-8 py-12 max-w-[1600px] mx-auto">
        {/* Search Results Info */}
        {isSearchActive && (
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div className="text-gray-600">
              <span className="text-lg font-medium">
                {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
              </span>
              {(searchFilters.location || searchFilters.keyword) && (
                <span className="ml-2">
                  for "{searchFilters.keyword || searchFilters.location}"
                </span>
              )}
              {searchFilters.type !== 'all' && (
                <span className="ml-2 text-blue-600 capitalize">
                  • {searchFilters.type.replace('_', ' ')}
                </span>
              )}
            </div>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
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
                onClick={retryFetch}
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
                  className="bg-[#083A85] text-white px-8 py-3 rounded-lg hover:bg-[#06316f] transition-colors font-medium"
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
                {totalCount > 0 
                  ? `All up`
                  : "All ups"
                }
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
              {isSearchActive 
                ? "Try adjusting your search criteria" 
                : "No properties available at the moment"
              }
            </p>
            {isSearchActive ? (
              <button
                onClick={clearSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Properties
              </button>
            ) : (
              <button
                onClick={retryFetch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;