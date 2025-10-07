"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import HouseCard from "../components/home/houseCard";
import { api } from "../api/api-conn";

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

const SpacesPage = () => {
  const searchParams = useSearchParams();
  const [houses, setHouses] = useState<HouseCardProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Filter states
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('priceRange') || '');
  const [beds, setBeds] = useState<string>(searchParams.get('beds') || '');
  const [baths, setBaths] = useState<string>(searchParams.get('baths') || '');
  const [guests, setGuests] = useState<string>(searchParams.get('guests') || '');
  const [propertyType, setPropertyType] = useState<string>(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
      if (propertyType) params.type = propertyType;
      if (beds) params.beds = parseInt(beds);
      if (baths) params.baths = parseInt(baths);
      if (guests) params.maxGuests = parseInt(guests);
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

      const response: any = await api.get('/properties/search', params);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch properties');
      }

      const propertiesData: any = response.data?.data || response.data || {};
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

    } catch (err: any) {
      console.error('Failed to fetch properties:', err);
      const errorMessage = err?.message || 'Failed to load properties';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [transformProperty, search, location, priceRange, beds, baths, guests, propertyType, sortBy, sortOrder]);

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
    setBeds('');
    setBaths('');
    setGuests('');
    setPropertyType('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  return (
    <div className="mt-18 p-2">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <a
            href="/"
            className="text-[#083A85] hover:text-[#06316f] font-medium transition-colors flex items-center gap-2 mb-4"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Home
          </a>
          <h1 className="text-xl font-bold text-gray-800">All Spaces</h1>
          <p className="text-gray-600 mt-2">Discover amazing spaces across East Africa</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by property name or amenities..."
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
              {(priceRange || beds || baths || guests || propertyType) && (
                <span className="bg-[#F20C8F] text-white text-xs px-2 py-0.5 rounded-full">
                  {[priceRange, beds, baths, guests, propertyType].filter(Boolean).length}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="condo">Condo</option>
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
                    <option value="0-50">Under $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-200">$100 - $200</option>
                    <option value="200-500">$200 - $500</option>
                    <option value="500+">$500+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <select
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A85] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="4">4+</option>
                    <option value="6">6+</option>
                    <option value="8">8+</option>
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
          {(search || location || priceRange || beds || baths || guests || propertyType) && (
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
              {propertyType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  Type: {propertyType}
                  <button onClick={() => setPropertyType('')} className="hover:text-indigo-900">
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
              {beds && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  Beds: {beds}+
                  <button onClick={() => setBeds('')} className="hover:text-pink-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {baths && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                  Baths: {baths}+
                  <button onClick={() => setBaths('')} className="hover:text-yellow-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {guests && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  Guests: {guests}+
                  <button onClick={() => setGuests('')} className="hover:text-orange-900">
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

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
            <div className="mb-6 text-gray-600">
              <span className="text-lg font-medium">
                {totalCount} {totalCount === 1 ? 'property' : 'properties'} available
              </span>
            </div>

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
                All properties displayed
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

export default SpacesPage;