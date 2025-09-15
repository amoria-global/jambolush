"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../lib/LanguageContext';

interface Tab {
  value: string;
  label: string;
  icon: string;
}

interface SearchSuggestion {
  [key: string]: string[];
}

interface SearchFilters {
  type: string;
  location: string;
  keyword: string;
}

interface HeroProps {
  onSearch?: (searchData: SearchFilters) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const t = useTranslations();
  
  // Fix: Initialize selectedTab with 'all' instead of empty string
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [location, setLocation] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState<boolean>(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const tabs: Tab[] = [
    { value: 'all', label: t('hero.tabs.all'), icon: 'bi-grid' },
    { value: 'tours', label: t('hero.tabs.spot'), icon: 'bi-geo-alt' },
    { value: 'stay', label: t('hero.tabs.stay'), icon: 'bi-calendar-check' },
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
      ).slice(0, 8)
    : [];

  const getSearchSuggestions = (): string[] => {
    // Use translated suggestions
    const baseSuggestions: SearchSuggestion = {
      all: [
        t('hero.suggestions.all.apartment'),
        t('hero.suggestions.all.house'),
        t('hero.suggestions.all.studio'),
        t('hero.suggestions.all.villa'),
        t('hero.suggestions.all.modern')
      ],
      spot: [
        t('hero.suggestions.spot.office'),
        t('hero.suggestions.spot.meeting'),
        t('hero.suggestions.spot.coworking'),
        t('hero.suggestions.spot.event'),
        t('hero.suggestions.spot.conference')
      ],
      stay: [
        t('hero.suggestions.stay.vacation'),
        t('hero.suggestions.stay.guest'),
        t('hero.suggestions.stay.hotel'),
        t('hero.suggestions.stay.serviced'),
        t('hero.suggestions.stay.shortterm')
      ]
    };
    
    if (!searchKeyword) return [];
    
    // Fix: Add safety check to ensure selectedTab exists in baseSuggestions
    const suggestions = baseSuggestions[selectedTab];
    if (!suggestions) return [];
    
    return suggestions.filter(
      (suggestion: string) => suggestion.toLowerCase().includes(searchKeyword.toLowerCase())
    );
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
    const searchPayload: SearchFilters = {
      type: selectedTab,
      location: location,
      keyword: searchKeyword
    };

    console.log('Search payload for API:', searchPayload);
    console.log('selectedTab current value:', selectedTab);
    console.log('selectedTab is empty string:', selectedTab === '');
    
    // Call the parent's onSearch handler if provided
    if (onSearch) {
      onSearch(searchPayload);
    }
  };

  // Handle Enter key press in inputs
  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search functionality
  const clearSearch = (): void => {
    setLocation('');
    setSearchKeyword('');
    setSelectedTab('all');
    
    if (onSearch) {
      onSearch({
        type: 'all',
        location: '',
        keyword: ''
      });
    }
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

  // Quick filters array with translations
  const quickFilters = [
    t('hero.quickFilters.under500'),
    t('hero.quickFilters.petFriendly'),
    t('hero.quickFilters.parking'),
    t('hero.quickFilters.furnished'),
    t('hero.quickFilters.nearMetro')
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
      <div className="relative z-10 pt-16 xs:pt-4 sm:pt-8 md:pt-5 lg:pt-0 text-center text-white px-4 w-full max-w-6xl mx-auto">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-4">
          {t('hero.title')}
        </h1>
        <p className=" text-base max-w-[200px] sm:max-w-full sm:block  mx-auto lg:text-lg mb-8 md:mb-12 opacity-90">
          {t('hero.subtitle')}
        </p>
        
        {/* Enhanced Search Container */}
        <div className="sm:bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Section */}
          <div className="sm:bg-gray-50 px-4 md:px-8 py-4 border-b border-gray-200">
            <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedTab(tab.value)}
                  className={`px-4 md:px-6 py-2 cursor-pointer md:py-2.5 rounded-lg text-base md:text-base font-medium flex items-center gap-2 transition-all duration-200 ${
                    selectedTab === tab.value
                      ? 'text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                  }`}
                  style={selectedTab === tab.value ? { backgroundColor: primaryBlue } : {}}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  <span className={isMobile && tab.value !== selectedTab ? 'hidden' : ''}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Search Fields Container */}
          <div className="p-4 md:p-8">
            <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'md:flex-row'}`}>
              {/* Location Field */}
              <div className="relative flex-1 md:flex-none md:w-1/3">
                <div className="relative">
                  <i 
                    className="bi bi-geo-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
                  ></i>
                  <input 
                    type="text" 
                    placeholder={t('hero.placeholders.location')}
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
                    className={`w-full pl-12 pr-4 py-3 md:py-4 border-3 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 sm:text-gray-800 text-base transition-colors duration-200 text-gray-200 ${isMobile ? 'placeholder:text-gray-300' : ''}`}
                  />
                </div>
                
                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationSelect(suggestion);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 text-gray-700 text-base transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      >
                        <i className="bi bi-geo-alt text-gray-400"></i>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Search Field */}
              <div className="relative flex-1">
                <div className="relative">
                  <i 
                    className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
                  ></i>
                  <input 
                    type="text" 
                    placeholder={t('hero.placeholders.search')}
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
                     className={`w-full pl-12 pr-4 py-3 md:py-4 border-3 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 sm:text-gray-800 text-base transition-colors duration-200 text-gray-200 ${isMobile ? 'placeholder:text-gray-300' : '' }`}
                  />
                </div>
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && getSearchSuggestions().length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-20">
                    {getSearchSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearchSelect(suggestion);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-pink-50 text-gray-700 text-base transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      >
                        <i className="bi bi-search text-gray-400"></i>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="text-white px-6 md:px-10 py-3 cursor-pointer md:py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:transform hover:scale-105 flex items-center justify-center gap-2 text-base"
                style={{ backgroundColor: primaryPink }}
              >
                <i className="bi bi-search"></i>
                <span>{t('hero.buttons.search')}</span>
              </button>
            </div>
            
            {/* Clear Search Button (only show when there are active filters) */}
            {(location || searchKeyword || selectedTab !== 'all') && (
              <div className="mt-4 text-center">
                <button
                  onClick={clearSearch}
                  className="text-gray-600 hover:text-gray-800 underline text-sm"
                >
                  {t('hero.buttons.clearFilters')}
                </button>
              </div>
            )}
            
            {/* Quick Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200 hidden sm:block">
              <div className="hidden sm:flex flex-wrap gap-2 items-center">
                <span className="text-base text-gray-500 mr-2">{t('hero.quickFiltersLabel')}:</span>
                {quickFilters.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchKeyword(filter);
                      handleSearch();
                    }}
                    className="px-3 py-1.5 cursor-pointer text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors duration-150"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-6 md:gap-12 text-white">
          <div className="flex items-center gap-2">
            <i className="bi bi-shield-check text-xl"></i>
            <span className="text-base md:text-base">{t('hero.trustIndicators.verified')}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="bi bi-headset text-xl"></i>
            <span className="text-base md:text-base">{t('hero.trustIndicators.support')}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="bi bi-cash-stack text-xl"></i>
            <span className="text-base md:text-base">{t('hero.trustIndicators.prices')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;