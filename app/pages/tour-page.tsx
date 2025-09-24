'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/app/api/api-conn';
import { encodeId } from '../utils/encoder';
import { calculateDisplayPrice, formatPrice } from '@/app/utils/pricing';

// Define the Tour type with pricing structure
type Tour = {
  id: string;
  title: string;
  image: string;
  price: number; // This will be the display price (base + 10%)
  basePrice?: number; // Base price from backend
  rating: number;
  reviews: number;
  location: string;
  duration: string;
  category: string;
  isBestseller?: boolean;
};

// Define TourFilters
type TourFilters = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "price" | "rating" | "reviews" | "title";
  sortOrder?: 'asc' | 'desc';
};

// --- HELPER HOOK (Unchanged) ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Helper Icons (Unchanged)
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = ({ active }: { active: boolean }) => (
  <button className="rounded-xs transition-all duration-200 group/heart">
    <i
      className={`${
        active
          ? 'bi bi-heart-fill text-red-400'
          : 'bi bi-heart text-white group-hover/heart:text-[#F20C8F]'
      } text-2xl transition-colors duration-200 drop-shadow-lg`}
    ></i>
  </button>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 mr-1.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 mr-1.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F20C8F]"></div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="max-w-md mx-auto">
      <i className="bi bi-exclamation-triangle text-6xl text-red-400 mb-4"></i>
      <h2 className="text-xl font-bold text-gray-700 mb-2">Something went wrong</h2>
      <p className="text-base text-gray-500 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Safe encode ID function
const safeEncodeId = (id: string | undefined | null): string => {
  if (!id) return '';
  try {
    return encodeId(id.toString());
  } catch (error) {
    console.error('Error encoding ID:', error, id);
    return '';
  }
};

// TourCard component with pricing display
const TourCard = ({
  tour,
  isFavorite,
  toggleFavorite,
}: {
  tour: Tour;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}) => {
  const encodedId = safeEncodeId(tour.id);
  
  if (!encodedId) {
    console.error('Invalid tour ID:', tour);
    return null;
  }

  return (
    <Link href={`/all/tours/${encodedId}`} legacyBehavior>
      <a className="block rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100">
        <div 
          className="relative h-48 bg-cover bg-center bg-gray-200"
          style={{ backgroundImage: `url(${tour.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
          {tour.isBestseller && (
            <div className="absolute top-2 left-2">
              <span className="bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white px-2 py-1 rounded-md text-base font-semibold shadow-lg">
                Best Seller
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2 z-10">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(tour.id);
              }}
              className="cursor-pointer"
            >
              <HeartIcon active={isFavorite} />
            </div>
          </div>
          <div className="absolute bottom-2 left-2">
            <div className="flex flex-col items-start">
              <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
                ${tour.price}/person
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#083A85] to-[#0B4A9F] p-4 text-white h-full">
          <div className="flex items-center mb-2">
            <StarIcon />
            <span className="text-base font-bold ml-1">{tour.rating}</span>
            <span className="text-base text-blue-100 ml-1.5">({tour.reviews})</span>
          </div>
          <h3 className="text-sm font-bold mb-2 text-white group-hover:text-blue-100 transition-colors leading-tight line-clamp-2">
            {tour.title}
          </h3>
          <div className="flex items-center mb-3 text-sm text-blue-100">
            <i className="bi bi-geo-alt-fill mr-1 text-sm"></i>
            <p className="truncate">{tour.location}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center bg-black/50 rounded-lg px-2 py-1 backdrop-blur-xl">
              <ClockIcon />
              <span className="text-xs text-white">{tour.duration}</span>
            </div>
            <div className="flex items-center bg-black/50 rounded-lg px-2 py-1 backdrop-blur-xl">
              <CheckIcon />
              <span className="text-xs text-white">Free cancellation</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-blue-100">
            <span className="truncate">{tour.category}</span>
            <span className="text-green-300">Available</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

// Helper function to safely extract error message
const getErrorMessage = (error: any): string => {
  if (error?.response?.message) {
    return error.response.message;
  }

  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Failed to load tours. Please try again.';
};

// Transform backend tour data to include display pricing
const transformTourData = (backendTour: any): Tour => {
  // Add null/undefined checks
  if (!backendTour) {
    throw new Error('Invalid tour data received');
  }

  // Ensure ID exists and is a string
  const id = backendTour.id || backendTour._id || '';
  if (!id) {
    console.error('Tour missing ID:', backendTour);
    throw new Error('Tour ID is missing');
  }

  const basePrice = backendTour.price || 0;
  const displayPrice = calculateDisplayPrice(basePrice);
  
  return {
    id: id.toString(), // Ensure it's a string
    title: backendTour.title || 'Untitled Tour',
    image: backendTour.image || `https://images.unsplash.com/photo-1464822759844-d150f39cbae2?w=400&h=300&fit=crop&q=80&random=${id}`,
    price: displayPrice, // Display price (base + 10%)
    basePrice: basePrice, // Keep base price for transparency
    rating: backendTour.rating || 4.5,
    reviews: backendTour.reviews || backendTour.totalReviews || 0,
    location: `${backendTour.locationCity || 'Unknown'}, ${backendTour.locationCountry || 'Unknown'}`,
    duration: backendTour.duration ? `${Math.floor(backendTour.duration / 24)} days` : '1 day',
    category: backendTour.category || 'Adventure',
    isBestseller: backendTour.isBestseller || false
  };
};

export default function BrowseToursPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedTours, setDisplayedTours] = useState<Tour[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>(['All']);
  
  // API state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const toursPerPage = 8;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch tours from API with pricing transformation
  const fetchTours = useCallback(async (filters?: TourFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare params object for the API call
      const params: any = {
        page: filters?.page || 1,
        limit: filters?.limit || toursPerPage,
      };

      if (filters?.category && filters.category !== 'All') {
        params.category = filters.category;
      }

      if (filters?.search) {
        params.search = filters.search;
      }

      if (filters?.sortBy) {
        params.sortBy = filters.sortBy;
        params.sortOrder = filters.sortOrder || 'asc';
      }
      
      console.log('Fetching tours with params:', params);
      
      const response = await api.get("/tours/search", { params });
      
      console.log('API Response:', response);
      
      if (response?.data?.success) {
        // Handle different response structures
        const toursData = response.data.data?.tours || response.data.tours || [];
        const totalData = response.data.data?.total || response.data.total || 0;
        const totalPagesData = response.data.data?.totalPages || response.data.totalPages || 0;
        
        // Transform tours to include display pricing with error handling
        const transformedTours = toursData.map((tour: any) => {
          try {
            return transformTourData(tour);
          } catch (transformError) {
            console.error('Error transforming tour data:', transformError, tour);
            return null;
          }
        }).filter(Boolean); // Remove any null results
        
        setDisplayedTours(transformedTours);
        setTotalResults(totalData);
        setTotalPages(totalPagesData);
      } else {
        throw new Error(response?.data?.message || 'Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Error fetching tours:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setDisplayedTours([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [toursPerPage]);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const categoriesResponse = await api.get("/tours/categories");
      if (categoriesResponse?.data?.success && Array.isArray(categoriesResponse.data.data)) {
        // Use Set to avoid duplicates
        const uniqueCategories = Array.from(new Set(['All', ...categoriesResponse.data.data]));
        setFilterCategories(uniqueCategories);
      } else {
        // Use default categories
        setFilterCategories(['All', 'Mountains', 'National Parks', 'Lakes & Rivers', 'Rift Valley', 'Museums & Historical Sites', 'City Tours', 'Adventure', 'Cultural', 'Wildlife', 'Relaxation', 'Hiking', 'Photography', 'Family', 'Romantic', 'Budget', 'Luxury']);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Use default categories if API fails
      setFilterCategories(['All', 'Mountains', 'National Parks', 'Lakes & Rivers', 'Rift Valley', 'Museums & Historical Sites', 'City Tours', 'Adventure', 'Cultural', 'Wildlife', 'Relaxation', 'Hiking', 'Photography', 'Family', 'Romantic', 'Budget', 'Luxury']);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      // Load categories and initial tours in parallel
      await Promise.all([
        loadCategories(),
        fetchTours({ page: 1, limit: toursPerPage })
      ]);
    };

    initializeData();
  }, []); // Empty dependency array - only run once on mount

  // Handle filter changes (after initial load)
  useEffect(() => {
    // Skip if initial load hasn't completed
    if (!initialLoadComplete) return;

    const filters: TourFilters = {
      page: currentPage,
      limit: toursPerPage,
    };

    if (activeFilter !== 'All') {
      filters.category = activeFilter;
    }

    if (debouncedSearchQuery.trim() !== '') {
      filters.search = debouncedSearchQuery.trim();
    }

    switch (sortOption) {
      case 'Price (low to high)':
        filters.sortBy = 'price';
        filters.sortOrder = 'asc';
        break;
      case 'Rating':
        filters.sortBy = 'rating';
        filters.sortOrder = 'desc';
        break;
      default:
        break;
    }

    fetchTours(filters);
  }, [activeFilter, sortOption, debouncedSearchQuery, currentPage, initialLoadComplete, fetchTours]);

  // Reset to first page when filters change
  useEffect(() => {
    if (initialLoadComplete) {
      setCurrentPage(1);
    }
  }, [activeFilter, sortOption, debouncedSearchQuery]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleRetry = () => {
    const filters: TourFilters = {
      page: currentPage,
      limit: toursPerPage,
    };

    if (activeFilter !== 'All') {
      filters.category = activeFilter;
    }

    if (searchQuery.trim() !== '') {
      filters.search = searchQuery.trim();
    }

    switch (sortOption) {
      case 'Price (low to high)':
        filters.sortBy = 'price';
        filters.sortOrder = 'asc';
        break;
      case 'Rating':
        filters.sortBy = 'rating';
        filters.sortOrder = 'desc';
        break;
    }

    fetchTours(filters);
  };

  const handleClearFilters = () => {
    setActiveFilter('All');
    setSearchQuery('');
    setSortOption('Featured');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 py-8 mt-10">
        <div className="mb-8 mt-20">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                disabled={loading}
                className={`px-3 py-2 text-base font-semibold rounded-full border transition-all duration-200 disabled:opacity-50 ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white border-[#F20C8F] shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 cursor-pointer'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for tours, locations, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
              className="w-full sm:w-1/2 border border-gray-400 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <i className="bi bi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 sm:right-auto sm:left-[45%]"></i>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <span className="text-base font-bold text-gray-700">
            {loading ? 'Loading...' : `${totalResults} results found`}
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            disabled={loading}
            className="text-gray-700 border border-gray-400 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F20C8F] bg-white min-w-[200px] disabled:opacity-50 cursor-pointer"
          >
            <option value="Featured">Sort by: Featured</option>
            <option value="Price (low to high)">Sort by: Price (low to high)</option>
            <option value="Rating">Sort by: Rating</option>
          </select>
        </div>

        {loading && !initialLoadComplete && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        
        {!loading && !error && displayedTours && displayedTours.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  isFavorite={favorites.includes(tour.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1 || loading}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Previous
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          disabled={loading}
                          className={`px-3 py-2 border rounded-lg text-base font-semibold transition-all duration-200 disabled:opacity-50 ${
                            currentPage === pageNumber 
                              ? 'bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white border-[#F20C8F]' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={currentPage === totalPages || loading}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
                <div className="text-base text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && (!displayedTours || displayedTours.length === 0) && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <i className="bi bi-search text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-xl font-bold text-gray-700 mb-2">No tours found</h2>
              <p className="text-base text-gray-500 mb-6">
                Try adjusting your filters or search terms to find your next adventure!
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}