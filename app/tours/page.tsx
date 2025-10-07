"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import TourCard from "../components/home/tourCard";
import { api } from "../api/api-conn";

interface Tour {
  id: number;
  title: string;
  shortDescription: string;
  category: string;
  type: string;
  duration: number;
  price: number;
  currency: string;
  mainImage: string;
  rating: number;
  totalReviews: number;
  difficulty: string;
  locationCity: string;
  locationCountry: string;
  tourGuideName: string;
  tourGuideProfileImage?: string;
  isActive: boolean;
  nextAvailableDate?: string;
}

interface TourCardProperty {
  id: number;
  image: string;
  category: string;
  type?: string;
  title: string;
  pricePerNight: string;
  location: string;
  duration: number;
  difficulty: string;
  groupSize?: number;
  rating?: number;
  reviews?: number;
  hostName?: string;
  availability?: string;
}

interface ToursData {
  tours: Tour[];
  total?: number;
  totalPages?: number;
  page?: number;
}

const ToursPage = () => {
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<TourCardProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Filter states
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('priceRange') || '');
  const [difficulty, setDifficulty] = useState<string>(searchParams.get('difficulty') || '');
  const [duration, setDuration] = useState<string>(searchParams.get('duration') || '');
  const [groupSize, setGroupSize] = useState<string>(searchParams.get('groupSize') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const transformTour = useCallback((tour: Tour): TourCardProperty => {
    return {
      id: tour.id,
      title: tour.title,
      image: tour.mainImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      category: tour.category?.charAt(0).toUpperCase() + tour.category?.slice(1).toLowerCase() || 'Tour',
      type: tour.type || 'Experience',
      pricePerNight: `${tour.currency || '$'}${tour.price}`,
      location: `${tour.locationCity}, ${tour.locationCountry}`,
      duration: tour.duration || 0,
      difficulty: tour.difficulty || 'Moderate',
      rating: tour.rating || 0,
      reviews: tour.totalReviews || 0,
      hostName: tour.tourGuideName,
      availability: tour.nextAvailableDate
    };
  }, []);

  const fetchProperties = useCallback(async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        page: page,
        limit: 12
      };

      if (search) params.search = search;
      if (location) params.location = location;
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      if (groupSize) params.groupSize = parseInt(groupSize);
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      // Parse price range
      if (priceRange) {
        if (priceRange.includes('-')) {
          const [min, max] = priceRange.split('-');
          params.minPrice = parseFloat(min);
          if (max) params.maxPrice = parseFloat(max);
        } else if (priceRange.endsWith('+')) {
          params.minPrice = parseFloat(priceRange.replace('+', ''));
        }
      }

      // Parse duration range
      if (duration) {
        if (duration.includes('-')) {
          const [min, max] = duration.split('-');
          params.minDuration = parseFloat(min);
          if (max) params.maxDuration = parseFloat(max);
        } else if (duration.endsWith('+')) {
          params.minDuration = parseFloat(duration.replace('+', ''));
        }
      }

      const response: any = await api.get('/tours/search', params);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tours');
      }

      const toursData: any = response.data?.data || response.data || {};
      const { tours = [], total = 0, totalPages = 1 } = toursData;
      const transformedTours = tours.map(transformTour);

      if (append) {
        setTours(prev => [...prev, ...transformedTours]);
      } else {
        setTours(transformedTours);
      }

      setTotalCount(total || transformedTours.length);
      setCurrentPage(page);
      setHasMore(page < (totalPages || 1) && transformedTours.length > 0);

    } catch (err: any) {
      console.error('Failed to fetch tours:', err);
      const errorMessage = err?.message || 'Failed to load tours';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [transformTour, search, location, priceRange, difficulty, duration, groupSize, category, sortBy, sortOrder]);

  useEffect(() => {
    fetchProperties(1, false);
  }, [fetchProperties]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchProperties(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, fetchProperties]);

  const retryFetch = useCallback(() => {
    fetchProperties(1, false);
  }, [fetchProperties]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchProperties(1, false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setPriceRange('');
    setDifficulty('');
    setDuration('');
    setGroupSize('');
    setCategory('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  return (
    <div className="mt-16 p-2">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <a
            href="/"
            className="text-[#083A85] hover:text-[#06316f] font-medium transition-colors flex items-center gap-2 mb-4"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Home
          </a>
          <h1 className="text-xl font-bold text-gray-800">
            <i className="bi bi-compass text-[#083A85] mr-3"></i>
            Tours & Experiences
          </h1>
          <p className="text-gray-600 mt-2">Discover amazing tours and experiences across East Africa</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search tours by name, type, or features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
              />
            </div>
            <div className="flex-1 relative">
              <i className="bi bi-geo-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <i className="bi bi-sliders"></i>
              Filters
              {(priceRange || difficulty || duration || groupSize || category) && (
                <span className="bg-[#F20C8F] text-white text-xs px-2 py-0.5 rounded-full">
                  {[priceRange, difficulty, duration, groupSize, category].filter(Boolean).length}
                </span>
              )}
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2.5 bg-[#F20C8F] hover:bg-[#d10a7a] text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <i className="bi bi-search"></i>
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="beach">Beach</option>
                    <option value="city">City Tours</option>
                    <option value="nature">Nature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any Price</option>
                    <option value="0-100">Under $100</option>
                    <option value="100-300">$100 - $300</option>
                    <option value="300-500">$300 - $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000+">$1,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any Duration</option>
                    <option value="0-1">Half Day (0-4 hrs)</option>
                    <option value="1-3">1-3 Days</option>
                    <option value="3-7">3-7 Days</option>
                    <option value="7-14">1-2 Weeks</option>
                    <option value="14+">2+ Weeks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any Level</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
                  <select
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any Size</option>
                    <option value="1">Solo (1)</option>
                    <option value="2">2-4 people</option>
                    <option value="5">5-10 people</option>
                    <option value="10">10+ people</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'price-asc') {
                        setSortBy('price');
                        setSortOrder('asc');
                      } else if (value === 'price-desc') {
                        setSortBy('price');
                        setSortOrder('desc');
                      } else if (value === 'rating') {
                        setSortBy('rating');
                        setSortOrder('desc');
                      } else {
                        setSortBy('createdAt');
                        setSortOrder('desc');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  <i className="bi bi-x-circle mr-2"></i>
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filters Tags */}
          {(search || location || priceRange || difficulty || duration || groupSize || category) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: {search}
                  <button onClick={() => setSearch('')} className="hover:text-blue-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Location: {location}
                  <button onClick={() => setLocation('')} className="hover:text-green-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  Category: {category}
                  <button onClick={() => setCategory('')} className="hover:text-indigo-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {priceRange && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Price: ${priceRange}
                  <button onClick={() => setPriceRange('')} className="hover:text-purple-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {duration && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  Duration: {duration} days
                  <button onClick={() => setDuration('')} className="hover:text-pink-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {difficulty && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                  Difficulty: {difficulty}
                  <button onClick={() => setDifficulty('')} className="hover:text-yellow-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {groupSize && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  Group: {groupSize}+
                  <button onClick={() => setGroupSize('')} className="hover:text-orange-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && !loading && tours.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 text-lg font-medium mb-2">
                Unable to load tours
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
        {loading && tours.length === 0 && (
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

        {/* Tours Grid */}
        {tours.length > 0 && (
          <>
            <div className="mb-6 text-gray-600">
              <span className="text-lg font-medium">
                {totalCount} {totalCount === 1 ? 'tour' : 'tours'} available
              </span>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-[#083A85] text-white px-8 py-3 rounded-lg hover:bg-[#06316f] transition-colors font-medium"
                >
                  Load More Tours
                </button>
              </div>
            )}

            {/* Loading More */}
            {loading && tours.length > 0 && (
              <div className="text-center mt-8">
                <div className="inline-flex items-center text-gray-500">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more tours...
                </div>
              </div>
            )}

            {/* End of results */}
            {!hasMore && tours.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                All tours displayed
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && tours.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No tours found
            </div>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={retryFetch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursPage;