import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock session state - replace with your actual auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'John Doe', avatar: null });

  // --- NEW: Refs for the dropdowns to detect outside clicks ---
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);

  // Router for navigation
  const router = useRouter();

  // Effect to handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- UPDATED: Effect to close dropdowns on outside click, using logic from login.tsx ---
  useEffect(() => {
    // If no dropdowns are open, no need to add the event listener
    if (!isProfileOpen && !isLangOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      // Handle Profile Dropdown
      if (isProfileOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }

      // Handle Language Dropdowns (Desktop & Mobile)
      // Only closes if the click is outside BOTH the desktop and mobile containers.
      const isOutsideDesktop = !langDropdownRef.current?.contains(event.target as Node);
      const isOutsideMobile = !mobileLangDropdownRef.current?.contains(event.target as Node);

      if (isLangOpen && isOutsideDesktop && isOutsideMobile) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup function to remove the listener when the effect re-runs or component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isLangOpen]); // Effect re-runs when dropdown states change


  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' }
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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#083A85] to-[#F20C8F] flex items-center justify-center">
              <img src="/favicon.ico" alt="logo" className='w-full h-full object-cover rounded-lg'/>
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isScrolled ? 'text-[#083A85]' : 'text-black/40'
            }`}>
              JamboLush
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Language Switcher */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center cursor-pointer space-x-1 px-3 py-2 rounded-lg transition-colors duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base">{getCurrentLanguage()?.flag}</span>
                <span className="text-base font-medium">{getCurrentLanguage()?.code.toUpperCase()}</span>
                <i className="bi bi-chevron-down text-base"></i>
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
                      className="w-full text-left cursor-pointer px-4 py-2 text-base text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Become a Host Button */}
            <button className="px-4 py-2 bg-[#F20C8F] text-white text-base font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300 cursor-pointer" onClick={() => router.push('/all/become-host')}>
              <i className="bi bi-house-add mr-2"></i>
              Become a Host
            </button>

            {/* find a tour button*/}
             <button onClick={() => {router.push('/all/tour-page');}} className="px-4 py-2 bg-[#F20C8F] text-white text-sm cursor-pointer font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300">
            <i className="bi bi-binoculars mr-2"></i>

                 Find a Tour
             </button>
            {/* Profile Section */}
            {isLoggedIn ? (
              <div className="relative" ref={profileDropdownRef}>
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
                      <i className="bi bi-person-fill text-white text-base"></i>
                    )}
                  </div>
                  <span className="text-base font-medium hidden lg:block">{user.name}</span>
                  <i className="bi bi-chevron-down text-base"></i>
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
                  onClick={() => {router.push('/all/login');}}
                  className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-[#083A85] hover:bg-gray-100' 
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => {router.push('/all/signup');}}
                  className="px-4 py-2 bg-[#083A85] text-white text-sm cursor-pointer font-medium rounded-lg hover:bg-[#083A85]/90 transition-colors duration-300"
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
              className={`p-2 cursor-pointer rounded-lg transition-colors duration-300 ${
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
              <div className="relative" ref={mobileLangDropdownRef}>
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
                    <span className="text-base font-medium">{getCurrentLanguage()?.name}</span>
                  </div>
                  <i className="bi bi-chevron-down text-base"></i>
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
                      <i className="bi bi-person-fill text-white text-base"></i>
                    </div>
                    <span className="text-base font-medium">{user.name}</span>
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
                      router.push('/all/logout');
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
                      setIsMobileMenuOpen(false);
                      router.push('/all/login');
                    }}
                    className={`w-full  px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 text-center border border-slate-300 ${
                      isScrolled 
                        ? 'text-[#083A85] hover:bg-gray-100' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/all/signup'); 
                    }}
                    className="w-full  px-3 py-2 bg-[#083A85] text-white text-sm font-medium rounded-lg hover:bg-[#083A85]/90 transition-colors duration-300"
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