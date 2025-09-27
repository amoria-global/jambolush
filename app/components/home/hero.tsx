"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '../../lib/LanguageContext';

interface Tab {
  value: string;
  label: string;
  icon: string;
  isRoute?: boolean;
  route?: string;
}

interface SearchSuggestion {
  [key: string]: string[];
}

interface PropertyFilters {
  type: string;
  location: string;
  keyword: string;
  priceRange: string;
  bedrooms: string;
  amenities: string[];
}

interface HeroProps {
  onSearch?: (searchData: PropertyFilters) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const t = useTranslations();
  const router = useRouter();
  
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState<boolean>(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const tabs: Tab[] = [
    { value: '', label: 'Properties', icon: 'bi-house-door' },
    { value: 'tours', label: 'Tours', icon: 'bi-compass', isRoute: true, route: '/all/tours' },
  ];

  const allLocations: string[] = [
     // Rwanda
    'Kigali, Rwanda',
    'Kimironko, Kigali',
    'Nyamirambo, Kigali',
    'Remera, Kigali',
    'Kicukiro, Kigali',
    'Gasabo, Kigali',
    'Musanze, Rwanda',
    'Huye, Rwanda',
    'Rubavu, Rwanda',
    'Rusizi, Rwanda',
    
    // Kenya
    'Nairobi, Kenya',
    'Westlands, Nairobi',
    'Kilimani, Nairobi',
    'Karen, Nairobi',
    'Lavington, Nairobi',
    'Mombasa, Kenya',
    'Kisumu, Kenya',
    'Nakuru, Kenya',
    'Eldoret, Kenya',
    'Malindi, Kenya',
    
    // Uganda
    'Kampala, Uganda',
    'Kololo, Kampala',
    'Nakasero, Kampala',
    'Bugolobi, Kampala',
    'Muyenga, Kampala',
    'Entebbe, Uganda',
    'Jinja, Uganda',
    'Mbarara, Uganda',
    'Gulu, Uganda',
    
    // Tanzania
    'Dar es Salaam, Tanzania',
    'Masaki, Dar es Salaam',
    'Oyster Bay, Dar es Salaam',
    'Mikocheni, Dar es Salaam',
    'Arusha, Tanzania',
    'Moshi, Tanzania',
    'Dodoma, Tanzania',
    'Zanzibar, Tanzania',
    'Mwanza, Tanzania',
    
    // Ethiopia
    'Addis Ababa, Ethiopia',
    'Bole, Addis Ababa',
    'Kazanchis, Addis Ababa',
    'Old Airport, Addis Ababa',
    'Bahir Dar, Ethiopia',
    'Hawassa, Ethiopia',
    'Gondar, Ethiopia',
    
    // Burundi
    'Bujumbura, Burundi',
    'Kiriri, Bujumbura',
    'Rohero, Bujumbura',
    'Gitega, Burundi'
  ];

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-500', label: 'Under $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000-2000', label: '$1,000 - $2,000' },
    { value: '2000-5000', label: '$2,000 - $5,000' },
    { value: '5000+', label: '$5,000+' }
  ];

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: 'studio', label: 'Studio' },
    { value: '1', label: '1 Bed' },
    { value: '2', label: '2 Beds' },
    { value: '3', label: '3 Beds' },
    { value: '4+', label: '4+ Beds' }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const locationSuggestions = location.length > 0 
    ? allLocations.filter(loc => 
        loc.toLowerCase().includes(location.toLowerCase())
      ).slice(0, 6)
    : [];

  const getSearchSuggestions = (): string[] => {
    const propertySuggestions = [
      'Modern apartment',
      'Luxury villa',
      'Furnished studio',
      'Family house',
      'Executive suite',
      'Penthouse',
      'Garden apartment',
      'City center flat'
    ];
    
    if (!searchKeyword) return [];
    
    return propertySuggestions.filter(
      (suggestion: string) => suggestion.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  };

  const handleTabSelect = (tab: Tab): void => {
    if (tab.isRoute && tab.route) {
      router.push(tab.route);
    } else {
      setSelectedTab(tab.value);
    }
  };

  const handleLocationSelect = (suggestion: string): void => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
  };

  const handleSearchSelect = (suggestion: string): void => {
    setSearchKeyword(suggestion);
    setShowSearchSuggestions(false);
  };

  const handleSearch = (): void => {
    // Only trigger search for properties tab, not for tours
    if (selectedTab === 'properties') {
      const searchPayload: PropertyFilters = {
        type: selectedTab,
        location: location,
        keyword: searchKeyword,
        priceRange: priceRange,
        bedrooms: bedrooms,
        amenities: []
      };

      console.log('Property search payload:', searchPayload);
      
      if (onSearch) {
        onSearch(searchPayload);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = (): void => {
    setLocation('');
    setSearchKeyword('');
    setPriceRange('');
    setBedrooms('');
    setSelectedTab('properties');
  };

  useEffect(() => {
    const handleClickOutside = (): void => {
      setShowLocationSuggestions(false);
      setShowSearchSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const primaryBlue = '#083A85';
  const primaryPink = '#F20C8F';
  const overlayColor = 'rgba(8, 58, 133, 0.2)';

  const quickFilters = [
    'Pet Friendly',
    'Parking Included',
    'Fully Furnished',
    'Near Transit',
    'Gym Access'
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("/hero/dbb0er.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: overlayColor }}></div>
      
      {/* Content */}
      <div className="relative z-10 pt-12 text-center text-white px-3 w-full max-w-4xl mx-auto">
        <h1 className="text-lg md:text-2xl font-bold mb-3">
          Find Your Perfect Home accross the world
        </h1>
        <p className="text-sm max-w-[180px] sm:max-w-full mx-auto md:text-base mb-6 opacity-90">
          Unlock premium properties and unforgettable experiences with Amoria
        </p>
        
        {/* Enhanced Search Container */}
        <div className="sm:bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Tab Section */}
          <div className="sm:bg-gray-50 px-3 md:px-6 py-3 border-b border-gray-200">
            <div className="flex gap-2 md:gap-3 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabSelect(tab)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    selectedTab === tab.value
                      ? 'text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                  }`}
                  style={selectedTab === tab.value ? { backgroundColor: primaryBlue } : {}}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Search Fields Container */}
          <div className="p-3 md:p-6">
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'md:flex-row'}`}>
              {/* Location Field */}
              <div className="relative flex-1 md:flex-none md:w-1/3">
                <div className="relative">
                  <i className="bi bi-geo-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input 
                    type="text" 
                    placeholder="Where do you want to stay?"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowLocationSuggestions(e.target.value.length > 0);
                    }}
                    onKeyPress={handleKeyPress}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (location.length > 0) {
                        setShowLocationSuggestions(true);
                      }
                    }}
                    className={`w-full pl-9 pr-3 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 sm:text-gray-800 text-sm transition-colors duration-200 text-gray-200 ${isMobile ? 'placeholder:text-gray-300' : ''}`}
                  />
                </div>
                
                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationSelect(suggestion);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 text-gray-700 text-sm transition-colors duration-150 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                      >
                        <i className="bi bi-geo-alt text-gray-400 text-xs"></i>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Search Field */}
              <div className="relative flex-1">
                <div className="relative">
                  <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input 
                    type="text" 
                    placeholder="Property type, amenities..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setShowSearchSuggestions(e.target.value.length > 0);
                    }}
                    onKeyPress={handleKeyPress}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (searchKeyword.length > 0) {
                        setShowSearchSuggestions(true);
                      }
                    }}
                    className={`w-full pl-9 pr-3 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 sm:text-gray-800 text-sm transition-colors duration-200 text-gray-200 ${isMobile ? 'placeholder:text-gray-300' : ''}`}
                  />
                </div>
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && getSearchSuggestions().length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {getSearchSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearchSelect(suggestion);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-pink-50 text-gray-700 text-sm transition-colors duration-150 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                      >
                        <i className="bi bi-search text-gray-400 text-xs"></i>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-600 px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 flex items-center gap-2 text-sm"
              >
                <i className="bi bi-sliders"></i>
                <span className="hidden md:inline">Filters</span>
              </button>
              
              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-md hover:transform hover:scale-105 flex items-center justify-center gap-2 text-sm cursor-pointer"
                style={{ backgroundColor: primaryPink }}
              >
                <i className="bi bi-search"></i>
                <span>Search</span>
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 rounded-lg border text-gray-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <select 
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    >
                      {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <select 
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    >
                      {bedroomOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Clear Search Button */}
            {(location || searchKeyword || priceRange || bedrooms) && (
              <div className="mt-3 text-center">
                <button
                  onClick={clearSearch}
                  className="text-gray-600 hover:text-gray-800 underline text-xs"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {/* Quick Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200 hidden sm:block">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 mr-2">Popular:</span>
                {quickFilters.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchKeyword(filter);
                      handleSearch();
                    }}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors duration-150"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Hero;