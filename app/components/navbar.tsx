import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock session state - replace with your actual auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'John Doe', avatar: null });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLang);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-sm border-b border-gray-200' 
        : 'bg-transparent '
    }`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#083A85] to-[#F20C8F] flex items-center justify-center">
              <i className="bi bi-tropical-storm text-white text-lg"></i>
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isScrolled ? 'text-[#083A85]' : 'text-white'
            }`}>
              JamboLush
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-sm">{getCurrentLanguage()?.flag}</span>
                <span className="text-sm font-medium">{getCurrentLanguage()?.code.toUpperCase()}</span>
                <i className="bi bi-chevron-down text-xs"></i>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Become a Host Button */}
            <button className="px-4 py-2 bg-[#F20C8F] text-white text-sm font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300">
              <i className="bi bi-house-add mr-2"></i>
              Become a Host
            </button>

            {/* Profile Section */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#083A85] to-[#F20C8F] flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full" />
                    ) : (
                      <i className="bi bi-person-fill text-white text-sm"></i>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                  <i className="bi bi-chevron-down text-xs"></i>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <a href="#dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="bi bi-speedometer2 mr-3"></i>
                      Dashboard
                    </a>
                    <a href="#profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="bi bi-person mr-3"></i>
                      Profile
                    </a>
                    <a href="#status" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="bi bi-activity mr-3"></i>
                      Status
                    </a>
                    <a href="#settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="bi bi-gear mr-3"></i>
                      Settings
                    </a>
                    <hr className="my-1" />
                    <button 
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <i className="bi bi-box-arrow-right mr-3"></i>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-[#083A85] hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Sign in
                </button>
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="px-4 py-2 bg-[#083A85] text-white text-sm font-medium rounded-lg hover:bg-[#083A85]/90 transition-colors duration-300"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t transition-colors duration-300 ${
            isScrolled ? 'border-gray-200 bg-white' : 'border-white/20 bg-black/20 backdrop-blur-sm'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              
              {/* Language Switcher Mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{getCurrentLanguage()?.flag}</span>
                    <span className="text-sm font-medium">{getCurrentLanguage()?.name}</span>
                  </div>
                  <i className="bi bi-chevron-down text-xs"></i>
                </button>
                
                {isLangOpen && (
                  <div className="mt-1 ml-4 space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
                          isScrolled 
                            ? 'text-gray-600 hover:bg-gray-100' 
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Become a Host Mobile */}
              <button className="w-full flex items-center px-3 py-2 bg-[#F20C8F] text-white text-sm font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300">
                <i className="bi bi-house-add mr-2"></i>
                Become a Host
              </button>

              {/* Profile Section Mobile */}
              {isLoggedIn ? (
                <div className="space-y-1">
                  <div className={`flex items-center px-3 py-2 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#083A85] to-[#F20C8F] flex items-center justify-center mr-3">
                      <i className="bi bi-person-fill text-white text-sm"></i>
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  
                  <a href="#dashboard" className={`flex items-center px-6 py-2 text-sm rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-600 hover:bg-gray-100' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}>
                    <i className="bi bi-speedometer2 mr-3"></i>
                    Dashboard
                  </a>
                  <a href="#profile" className={`flex items-center px-6 py-2 text-sm rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-600 hover:bg-gray-100' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}>
                    <i className="bi bi-person mr-3"></i>
                    Profile
                  </a>
                  <a href="#status" className={`flex items-center px-6 py-2 text-sm rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-600 hover:bg-gray-100' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}>
                    <i className="bi bi-activity mr-3"></i>
                    Status
                  </a>
                  <a href="#settings" className={`flex items-center px-6 py-2 text-sm rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-600 hover:bg-gray-100' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}>
                    <i className="bi bi-gear mr-3"></i>
                    Settings
                  </a>
                  <button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-6 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                  >
                    <i className="bi bi-box-arrow-right mr-3"></i>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                      isScrolled 
                        ? 'text-[#083A85] hover:bg-gray-100' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Sign in
                  </button>
                  <button 
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 bg-[#083A85] text-white text-sm font-medium rounded-lg hover:bg-[#083A85]/90 transition-colors duration-300"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

     
    </nav>
  );
};

export default Navbar;