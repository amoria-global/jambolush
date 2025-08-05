import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [location, setLocation] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState<boolean>(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  
  interface Tab {
    value: string;
    label: string;
    icon: string;
  }

  const tabs: Tab[] = [
    { value: 'all', label: 'All', icon: 'bi-grid' },
    { value: 'spot', label: 'Spot', icon: 'bi-geo-alt' },
    { value: 'stay', label: 'Stay', icon: 'bi-calendar-check' },
  ];

  // East African location suggestions
  const allLocations = [
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

  // Filter locations based on input
  const locationSuggestions = location.length > 0 
    ? allLocations.filter(loc => loc.toLowerCase().includes(location.toLowerCase())).slice(0, 8)
    : [];

  // Search suggestions based on tab selection
  const getSearchSuggestions = (): string[] => {
    const baseSuggestions: Record<string, string[]> = {
      all: ['2 bedroom apartment', '3 bedroom house', 'furnished studio', 'villa with pool', 'modern apartment'],
      spot: ['office space', 'meeting room', 'coworking desk', 'event venue', 'conference hall'],
      stay: ['vacation rental', 'guest house', 'hotel apartment', 'serviced apartment', 'short-term rental']
    };
    
    if (!searchKeyword) return [];
    
    return baseSuggestions[selectedTab].filter(
      suggestion => suggestion.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  };

  const handleLocationSelect = (suggestion: string) => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
  };

  const handleSearchSelect = (suggestion: string) => {
    setSearchKeyword(suggestion);
    setShowSearchSuggestions(false);
  };

  const handleSearch = () => {
    // API payload structure
    const searchPayload = {
      type: selectedTab,
      location: location,
      keyword: searchKeyword,
      timestamp: new Date().toISOString()
    };
    
    console.log('Search payload for API:', searchPayload);
    // TODO: Post to API endpoint
    // fetch('/api/search', { method: 'POST', body: JSON.stringify(searchPayload) })
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowLocationSuggestions(false);
      setShowSearchSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div 
      className="h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("/hero/dbb0er.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8, 58, 133, 0.2)' }}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 w-full max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Discover your place to live</h1>
        <p className="text-base md:text-xl mb-12 opacity-90">Let us help you make the right move today!</p>
        
        {/* Search Container */}
        <div className="bg-white rounded-lg p-6 shadow-xl">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                  selectedTab === tab.value
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedTab === tab.value ? { backgroundColor: '#083A85' } : {}}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Search Fields */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Location - Smaller */}
            <div className="relative md:w-1/3">
              <i className="bi bi-geo-alt" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
                zIndex: 1
              }}></i>
              <input 
                type="text" 
                placeholder="Browse location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(e.target.value.length > 0);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLocationSuggestions(location.length > 0);
                }}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-700"
                style={{ paddingLeft: '40px' }}
              />
              {/* Location Suggestions */}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {locationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationSelect(suggestion);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700 text-sm first:rounded-t-lg last:rounded-b-lg"
                    >
                      <i className="bi bi-geo-alt text-gray-400 mr-2"></i>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search Keyword - Larger */}
            <div className="relative flex-1">
              <i className="bi bi-search" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
                zIndex: 1
              }}></i>
              <input 
                type="text" 
                placeholder="Search keyword"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setShowSearchSuggestions(e.target.value.length > 0);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSearchSuggestions(searchKeyword.length > 0);
                }}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-700"
                style={{ paddingLeft: '40px' }}
              />
              {/* Search Suggestions */}
              {showSearchSuggestions && getSearchSuggestions().length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {getSearchSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSearchSelect(suggestion);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700 text-sm first:rounded-t-lg last:rounded-b-lg"
                    >
                      <i className="bi bi-search text-gray-400 mr-2"></i>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="text-white px-8 py-3 rounded-lg font-medium transition hover:opacity-90 flex items-center justify-center gap-2 "
              style={{ backgroundColor: '#F20C8F' }}
            >
              <i className="bi bi-search"></i>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;