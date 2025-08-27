'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// --- HELPER HOOK (NEW) ---
// This custom hook delays updating a value until a certain amount of time has passed without it changing.
// This prevents the search function from running on every single keystroke.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


// 1. Updated TypeScript Interface
interface Tour {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  image: string;
  isBestseller?: boolean;
  category: string;
}

// 2. Expanded Mock Data Set
const allTours: Tour[] = [
  {
    id: '1',
    title: 'Karisimbi Volcano Climbing Tour',
    location: 'Rwanda, Musanze(North Province)',
    rating: 4.9,
    reviews: 327,
    duration: '2 to 8 hours',
    price: 406,
    image: 'https://i.pinimg.com/736x/89/3d/7d/893d7d40a3bbf9c61aba544507f28e79.jpg',
    isBestseller: true,
    category: 'Mountains',
  },
  {
    id: '2',
    title: 'Nyungwe Forest National Park',
    location: 'Rwanda, Rusizi(Western Province)',
    rating: 4.8,
    reviews: 758,
    duration: '10 hours',
    price: 72,
    image: 'https://i.pinimg.com/1200x/48/40/65/484065febd36354e52e71a6046c170d2.jpg',
    category: 'National Parks',
  },
  {
    id: '3',
    title: 'Mount Bisokei Volcano Climbing Tour',
    location: 'Rwanda, Musanze(North Province)',
    rating: 4.6,
    reviews: 1581,
    duration: '10 hours',
    price: 84,
    image: 'https://i.pinimg.com/736x/8e/08/ed/8e08ed98ebf21b0a1cb54520329a7f7e.jpg',
    category: 'Mountains',
  },
  {
    id: '4',
    title: 'Ethnographic Museum Tour',
    location: 'Rwanda, Huye(Southern Province)',
    rating: 4.3,
    reviews: 77,
    duration: '4 to 5 hours',
    price: 59,
    image: 'https://i.pinimg.com/736x/e2/bc/a0/e2bca0c85a23ae42b91b5f75643ec23d.jpg',
    category: 'Museums & Historical Sites',
  },
  {
    id: '5',
    title: 'Lake Kivu Boat Cruise',
    location: 'Rwanda, Rubavu(Western Province)',
    rating: 4.5,
    reviews: 931,
    duration: '6 hours',
    price: 45,
    image: 'https://i.pinimg.com/736x/4f/17/5c/4f175cd4e1b5e639080a22f8a4dab463.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '6',
    title: 'Lake Kivu Shorelines & Waterfalls Tour',
    location: 'Rwanda, Rubavu(Western Province)',
    rating: 4.9,
    reviews: 644,
    duration: '3 hours',
    price: 35,
    image: 'https://i.pinimg.com/736x/48/8e/3b/488e3be5edf996237d109fd02674876f.jpg',
    isBestseller: true,
    category: 'Rift Valley',
  },
  {
    id: '7',
    title: 'Mount Nyiragongo Volcano Climbing Tour',
    location: 'Rwanda,Rubavu(wesrern Province)',
    rating: 4.7,
    reviews: 512,
    duration: '4 hours',
    price: 120,
    image: 'https://i.pinimg.com/1200x/b5/e3/75/b5e3754f36e9b3fdc1be55efaf22d31a.jpg',
    category: 'Mountains',
  },
  {
    id: '8',
    title: 'Akagera National Park Safari Tour',
    location: 'Rwanda, Kayonza(Eastern Province)',
    rating: 4.6,
    reviews: 389,
    duration: '8 hours',
    price: 150,
    image: 'https://i.pinimg.com/736x/b8/3f/02/b83f0269a8b77d41c0a93e179f9861b4.jpg',
    category: 'National Parks',
  },
  {
    id: '9',
    title: 'Twin Lakes Burera & Ruhondo Boat Tour',
    location: 'Rwanda, Musanze(North Province)',
    rating: 4.8,
    reviews: 234,
    duration: '4 hours',
    price: 95,
    image: 'https://i.pinimg.com/1200x/d4/9a/e4/d49ae4213d0960c7b55f1baf2ca0a7d6.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '10',
    title: 'King’s Palace Museum Tour in Nyanza',
    location: 'Rwanda, Nyanza(Southern Province)',
    rating: 4.4,
    reviews: 156,
    duration: '6 hours',
    price: 68,
    image: 'https://i.pinimg.com/736x/e8/9a/ca/e89acac0154f51d20d48c8608654466c.jpg',
    category: 'Museums & Historical Sites',
  },
  {
    id: '11',
    title: 'Kigali City Cultural & Historical Tour',
    location: 'Rwanda, Kigali(City)',
    rating: 4.5,
    reviews: 478,
    duration: '5 hours',
    price: 55,
    image: 'https://i.pinimg.com/736x/8f/70/69/8f7069b68996d2bfcb4b812959eec3c6.jpg',
    category: 'City Tours',
  },
  {
    id: '12',
    title: 'Gisenyi City Tour & Beach Relaxation',
    location: 'Rwanda, Rubavu(Western Province)',
    rating: 4.7,
    reviews: 312,
    duration: '6 hours',
    price: 60,
    image: 'https://i.pinimg.com/736x/55/6c/a8/556ca8466d3e93e59d64fabcaf1e3041.jpg',
    isBestseller: true,
    category: 'City Tours',
  },
  {
    id: '13',
    title: 'Volcanoes National Park Gorilla Trekking',
    location: 'Rwanda, Musanze(North Province)',
    rating: 4.9,
    reviews: 1024,
    duration: '8 hours',
    price: 1500,
    image: 'https://i.pinimg.com/1200x/9b/d3/c4/9bd3c4a356cb185695d7dac37a2198a6.jpg',
    isBestseller: true,
    category: 'National Parks',
  },
  {
    id: '14',
    title: 'Cultural Village Tour in Iby’Iwacu',
    location: 'Rwanda, Musanze(North Province)',
    rating: 4.6,
    reviews: 256,
    duration: '3 hours',
    price: 40,
    image: 'https://i.pinimg.com/1200x/1c/e2/19/1ce21983edb696a367a02328d0797d9c.jpg',
    category: 'Cultural',
  },
  {
    id: '15',
    title: 'Rwanda Wildlife Safari in Akagera',
    location: 'Rwanda, Kayonza(Eastern Province)',
    rating: 4.8,
    reviews: 512,
    duration: '10 hours',
    price: 200,
    image: 'https://i.pinimg.com/736x/31/56/91/315691d96379d5705864d356eae90bcb.jpg',
    category: 'Wildlife',
  },
  {
    id: '16',
    title: 'Relaxing Day at Lake Muhazi',
    location: 'Rwanda, Kayonza(Eastern Province)',
    rating: 4.5,
    reviews: 128,
    duration: '5 hours',
    price: 30,
    image: 'https://i.pinimg.com/736x/10/2f/8c/102f8c0a0cb85f210456ca70bd89035d.jpg',
    category: 'Relaxation',
  },
  {
    id: '17',
    title: 'Hiking Adventure in Gishwati Forest',
    location: 'Rwanda, Rubavu(Western Province)',
    rating: 4.7,
    reviews: 342,
    duration: '6 hours',
    price: 75,
    image: 'https://i.pinimg.com/736x/fc/1d/3b/fc1d3bb67539b24e1f0a73cf4f603488.jpg',
    category: 'Hiking',
  },
  {
    id: '18',
    title: 'Photography Tour of Kigali City',
    location: 'Rwanda, Kigali(City)',
    rating: 4.6,
    reviews: 198,
    duration: '4 hours',
    price: 50,
    image: 'https://i.pinimg.com/1200x/b3/d2/ae/b3d2ae7a54b9e654baf36a0063dc9f49.jpg',
    category: 'Photography',
  },
  {
    id: '19',
    title: 'Family Fun Day at Akagera National Park',
    location: 'Rwanda, Kayonza(Eastern Province)',
    rating: 4.8,
    reviews: 276,
    duration: '8 hours',
    price: 180,
    image: 'https://i.pinimg.com/1200x/87/fc/ca/87fcca318e196e365ccdac35ba75f789.jpg',
    category: 'Family',
  },
  {
    id: '20',
    title: 'Romantic Sunset Cruise on Lake Kivu',
    location: 'Rwanda, Rubavu(Western Province)',
    rating: 4.9,
    reviews: 154,
    duration: '3 hours',
    price: 120,
    image: 'https://i.pinimg.com/736x/43/7a/ff/437aff3d23fa587f36937805c4061d74.jpg',
    category: 'Romantic',
  },
{
    id: '21',
    title: 'Budget-Friendly Kigali City Tour',
    location: 'Rwanda, Kigali(City)',
    rating: 4.4,
    reviews: 98,
    duration: '4 hours',
    price: 25,
    image: 'https://i.pinimg.com/736x/83/89/2f/83892f67a57f9ff109dd4ac1778c71bf.jpg',
    category: 'Budget',
  },
  {
    id: '22',
    title: 'Luxury Gorilla Trekking Experience',
    location: 'Rwanda, Musanze(North Province)',
    rating: 5.0,
    reviews: 204,
    duration: '8 hours',
    price: 2500,
    image: 'https://i.pinimg.com/736x/52/a6/89/52a689bd83f6a3a1c2dd75e822b70f39.jpg',
    isBestseller: true,
    category: 'Luxury',
},
  {
    id: '23', // Note: Corrected duplicate ID from 12 to 23
    title: 'Nyandungu great Kigali City Tour',
    location: 'Rwanda, Kigali(City)',
    rating: 4.7,
    reviews: 312,
    duration: '6 hours',
    price: 60,
    image: 'https://i.pinimg.com/736x/78/9a/52/789a522c98064076abd5660940c4e0bd.jpg',
    isBestseller: true,
    category: 'City Tours',
  },
];
  
// Helper Icons
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

// TourCard component (unchanged)
const TourCard = ({
  tour,
  isFavorite,
  toggleFavorite,
}: {
  tour: Tour;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}) => (
  <Link href={`/all/tour/${tour.id}`} legacyBehavior>
    <a className="block rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100">
      <div 
        className="relative h-48 bg-cover bg-center bg-gray-200"
        style={{ backgroundImage: `url(${tour.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        {tour.isBestseller && (
          <div className="absolute top-2 left-2">
            <span className="bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white px-2 py-1 rounded-md text-sm font-semibold shadow-lg">
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
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
            ${tour.price}/person
          </span>
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#083A85] to-[#0B4A9F] p-4 text-white h-full">
        <div className="flex items-center mb-2">
          <StarIcon />
          <span className="text-sm font-bold ml-1">{tour.rating}</span>
          <span className="text-sm text-blue-100 ml-1.5">({tour.reviews})</span>
        </div>
        <h3 className="text-sm font-bold mb-2 text-white group-hover:text-blue-100 transition-colors leading-tight line-clamp-2">
          {tour.title}
        </h3>
        <div className="flex items-center mb-3 text-sm text-blue-100">
          <i className="bi bi-geo-alt-fill mr-1 text-sm"></i>
          <p className="truncate">{tour.location}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center bg-black/50 rounded px-2 py-1 backdrop-blur-xl">
            <ClockIcon />
            <span className="text-xs text-white">{tour.duration}</span>
          </div>
          <div className="flex items-center bg-black/50 rounded px-2 py-1 backdrop-blur-xl">
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


export default function BrowseToursPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 8;

  // --- MODIFICATION 1: Use the debounced value for filtering ---
  // We use the custom hook to create a debounced version of the search query.
  // The filtering logic will only run when this value changes (300ms after the user stops typing).
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [displayedTours, setDisplayedTours] = useState<Tour[]>(allTours);

  const filterCategories = ['All', 'Mountains', 'National Parks', 'Lakes & Rivers', 'Rift Valley', 'Museums & Historical Sites', 'City Tours', 'Adventure', 'Cultural', 'Wildlife', 'Relaxation', 'Hiking', 'Photography', 'Family', 'Romantic', 'Budget', 'Luxury'];

  // --- MODIFICATION 2: Update useEffect and search logic ---
  useEffect(() => {
    let filtered = allTours;

    // 1. Category filter (unchanged)
    if (activeFilter !== 'All') {
      filtered = filtered.filter((tour) => tour.category === activeFilter);
    }

    // 2. Search filter (IMPROVED LOGIC)
    if (debouncedSearchQuery.trim() !== '') {
      // Split the search query into individual words (tokens)
      const searchTerms = debouncedSearchQuery.toLowerCase().split(' ').filter(term => term);

      filtered = filtered.filter((tour) => {
        // Combine all searchable text fields from the tour into one string
        const searchableText = `
          ${tour.title} 
          ${tour.location} 
          ${tour.category}
        `.toLowerCase();
        
        // Check if the searchable text includes EVERY term from the search query
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // 3. Sorting logic (unchanged)
    let sorted = [...filtered];
    switch (sortOption) {
      case 'Price (low to high)':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'Rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured sort can remain as is, or you could add another metric like reviews
        sorted.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    setDisplayedTours(sorted);
    setCurrentPage(1); // Reset to first page after any filter/sort change
  }, [activeFilter, sortOption, debouncedSearchQuery]); // --- DEPEND ON DEBOUNCED VALUE ---

  // Pagination logic (unchanged)
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = displayedTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(displayedTours.length / toursPerPage);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // JSX/Return statement (unchanged)
  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 py-8 mt-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Unforgettable Journeys Await; Explore With Our Passionate 
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3 py-2 text-sm font-semibold rounded-full border transition-all duration-200 ${
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
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition-all duration-200"
            />
            <i className="bi bi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:right-auto sm:left-[45%]"></i>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <span className="text-sm font-semibold text-gray-700">
            {displayedTours.length} results found
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F20C8F] bg-white min-w-[200px]"
          >
            <option value="Featured">Sort by: Featured</option>
            <option value="Price (low to high)">Sort by: Price (low to high)</option>
            <option value="Rating">Sort by: Rating</option>
          </select>
        </div>
        {currentTours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  isFavorite={favorites.includes(tour.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 border rounded-lg text-sm font-semibold transition-all duration-200 ${
                        currentPage === i + 1 
                          ? 'bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white border-[#F20C8F]' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <i className="bi bi-search text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-xl font-bold text-gray-700 mb-2">No tours found</h2>
              <p className="text-sm text-gray-500 mb-6">
                Try adjusting your filters or search terms to find your next adventure!
              </p>
              <button
                onClick={() => {
                  setActiveFilter('All');
                  setSearchQuery('');
                }}
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