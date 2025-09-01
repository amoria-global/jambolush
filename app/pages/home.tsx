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

 // Sample data for house rental/reservation
const houses = [
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
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Family Suburban Home",
    pricePerNight: "$65",
    location: "Austin, TX",
    beds: 3,
    baths: 2,
    rating: 4.8,
    reviews: 156,
    hostName: "Jessica L.",
    availability: "Available"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=800&q=80",
    category: "Condo",
    title: "Beachfront Condominium",
    pricePerNight: "$95",
    location: "Miami, FL",
    beds: 2,
    baths: 2,
    rating: 4.6,
    reviews: 203,
    hostName: "Carlos R.",
    availability: "Booked"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&q=80",
    category: "Townhouse",
    title: "Historic Townhouse",
    pricePerNight: "$78",
    location: "Boston, MA",
    beds: 3,
    baths: 3,
    rating: 4.5,
    reviews: 92,
    hostName: "Emily C.",
    availability: "Available"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&q=80",
    category: "Villa",
    title: "Mountain View Estate",
    pricePerNight: "$185",
    location: "Aspen, CO",
    beds: 5,
    baths: 4,
    rating: 5.0,
    reviews: 67,
    hostName: "Robert H.",
    availability: "Available"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
    category: "Penthouse",
    title: "City Skyline Penthouse",
    pricePerNight: "$250",
    location: "Chicago, IL",
    beds: 4,
    baths: 4,
    rating: 4.8,
    reviews: 145,
    hostName: "David W.",
    availability: "Available"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Cozy Ranch Style Home",
    pricePerNight: "$55",
    location: "Phoenix, AZ",
    beds: 3,
    baths: 2,
    rating: 4.4,
    reviews: 178,
    hostName: "Maria G.",
    availability: "Available"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
    category: "Apartment",
    title: "High-Rise Studio",
    pricePerNight: "$45",
    location: "Seattle, WA",
    beds: 1,
    baths: 1,
    rating: 4.3,
    reviews: 234,
    hostName: "Alex T.",
    availability: "Available"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
    category: "Condo",
    title: "Lakefront Retreat",
    pricePerNight: "$85",
    location: "Lake Tahoe, CA",
    beds: 2,
    baths: 2,
    rating: 4.7,
    reviews: 112,
    hostName: "Lisa P.",
    availability: "Booked"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1600566752734-90b5dc6b04ab?auto=format&fit=crop&w=800&q=80",
    category: "Villa",
    title: "Mediterranean Paradise",
    pricePerNight: "$165",
    location: "San Diego, CA",
    beds: 6,
    baths: 5,
    rating: 4.9,
    reviews: 98,
    hostName: "Antonio M.",
    availability: "Available"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
    category: "Townhouse",
    title: "Contemporary Urban Townhouse",
    pricePerNight: "$92",
    location: "Portland, OR",
    beds: 3,
    baths: 3,
    rating: 4.6,
    reviews: 167,
    hostName: "Rachel B.",
    availability: "Available"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1600607688960-e095ff4e4294?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Colonial Style Family Home",
    pricePerNight: "$72",
    location: "Richmond, VA",
    beds: 4,
    baths: 3,
    rating: 4.5,
    reviews: 134,
    hostName: "Thomas J.",
    availability: "Available"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
    category: "Penthouse",
    title: "Luxury Rooftop Penthouse",
    pricePerNight: "$220",
    location: "Los Angeles, CA",
    beds: 3,
    baths: 3,
    rating: 4.8,
    reviews: 189,
    hostName: "Jennifer S.",
    availability: "Booked"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    category: "Apartment",
    title: "Garden View Apartment",
    pricePerNight: "$68",
    location: "Nashville, TN",
    beds: 2,
    baths: 2,
    rating: 4.4,
    reviews: 145,
    hostName: "Mark D.",
    availability: "Available"
  },
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=800&q=80",
    category: "Condo",
    title: "Ski Resort Condo",
    pricePerNight: "$105",
    location: "Park City, UT",
    beds: 2,
    baths: 2,
    rating: 4.7,
    reviews: 87,
    hostName: "Kevin L.",
    availability: "Available"
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Craftsman Bungalow",
    pricePerNight: "$82",
    location: "Denver, CO",
    beds: 3,
    baths: 2,
    rating: 4.6,
    reviews: 156,
    hostName: "Nicole F.",
    availability: "Available"
  },
  {
    id: 18,
    image: "https://images.unsplash.com/photo-1600566752734-90b5dc6b04ab?auto=format&fit=crop&w=800&q=80",
    category: "Villa",
    title: "Countryside Estate",
    pricePerNight: "$145",
    location: "Napa Valley, CA",
    beds: 5,
    baths: 4,
    rating: 4.9,
    reviews: 76,
    hostName: "William R.",
    availability: "Available"
  },
  {
    id: 19,
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    category: "Townhouse",
    title: "Victorian Townhouse",
    pricePerNight: "$98",
    location: "San Francisco, CA",
    beds: 3,
    baths: 3,
    rating: 4.5,
    reviews: 123,
    hostName: "Catherine A.",
    availability: "Booked"
  },
  {
    id: 20,
    image: "https://images.unsplash.com/photo-1600607688684-c79f4ff7ef03?auto=format&fit=crop&w=800&q=80",
    category: "Apartment",
    title: "Loft Style Apartment",
    pricePerNight: "$76",
    location: "Atlanta, GA",
    beds: 2,
    baths: 2,
    rating: 4.3,
    reviews: 198,
    hostName: "Jonathan V.",
    availability: "Available"
  },
  {
    id: 21,
    image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=800&q=80",
    category: "Penthouse",
    title: "Ocean View Penthouse",
    pricePerNight: "$320",
    location: "Malibu, CA",
    beds: 4,
    baths: 5,
    rating: 5.0,
    reviews: 54,
    hostName: "Stephanie H.",
    availability: "Available"
  }
];
    return (
      <div>
        <Hero onSearch={function (filters: any): void {
          throw new Error("Function not implemented.");
        } } />
        <div className="listings-container px-4 sm:px-6 lg:px-8 py-12 max-w-[1600px] mx-auto">
          {/* 7-column grid with proper responsive breakpoints */}

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