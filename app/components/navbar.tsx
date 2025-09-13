import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import api from "../api/apiService";
import { useLanguage } from '../lib/LanguageContext';

interface UserProfile {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneCountryCode: string;
  profile: string | null;
  country: string;
  state: string | null;
  province: string | null;
  city: string | null;
  street: string | null;
  zipCode: string | null;
  postalCode: string | null;
  postcode: string | null;
  pinCode: string | null;
  eircode: string | null;
  cep: string | null;
  status: string;
  userType: string;
  provider: string;
}

interface UserSession {
  user: UserProfile;
  token: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Language context
  const { currentLanguage, changeLanguage, t, isLoading: langLoading } = useLanguage();

  // Refs for the dropdowns to detect outside clicks
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);

  // Router for navigation
  const router = useRouter();

  // Available languages (moved from local state to context)
  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇺🇸', nativeName: 'English' },
    { code: 'es', name: t('languages.es'), flag: '🇪🇸', nativeName: 'Español' },
    { code: 'fr', name: t('languages.fr'), flag: '🇫🇷', nativeName: 'Français' },
    { code: 'sw', name: t('languages.sw'), flag: '🇹🇿', nativeName: 'Kiswahili' },
    { code: 'rw', name: t('languages.rw'), flag: '🇷🇼', nativeName: 'Ikinyarwanda' }
  ];

  // Function to fetch user session
  const fetchUserSession = async () => {
    try {
      setIsLoading(true);
      
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setIsLoggedIn(false);
        setUser(null);
        setUserSession(null);
        setIsLoading(false);
        return;
      }

      // Set authorization header
      api.setAuth(authToken)
      const response = await api.get('auth/me');

      if (response.data) {
        const userData = response.data;
        setUserSession({ user: userData, token: authToken });
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        // Invalid token, clear localStorage
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUser(null);
        setUserSession(null);
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUser(null);
      setUserSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
    setUserSession(null);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  // Function to handle language change
  const handleLanguageChange = async (langCode: string) => {
    try {
      await changeLanguage(langCode);
      setIsLangOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Effect to fetch user session on component mount
  useEffect(() => {
    fetchUserSession();
  }, []);

  // Effect to handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to close dropdowns on outside click
  useEffect(() => {
    if (!isProfileOpen && !isLangOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      // Handle Profile Dropdown
      if (isProfileOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }

      // Handle Language Dropdowns (Desktop & Mobile)
      const isOutsideDesktop = !langDropdownRef.current?.contains(event.target as Node);
      const isOutsideMobile = !mobileLangDropdownRef.current?.contains(event.target as Node);

      if (isLangOpen && isOutsideDesktop && isOutsideMobile) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isLangOpen]);

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage.code) || languages[0];
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return t('nav.profile', 'User');
    return user.name || `${user.firstName} ${user.lastName}`.trim() || user.email;
  };

  // Helper function to get user avatar or initials
  const getUserAvatar = () => {
    if (user?.profile) return user.profile;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      return names.length > 1 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Don't render if translations are loading
  if (langLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white shadow-sm'
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
              {t('nav.brandName')}
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
                    ? 'text-silver-700 hover:bg-silver-100'
                    : 'text-silver-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base">{getCurrentLanguage()?.flag}</span>
                <span className="text-base font-medium">{getCurrentLanguage()?.code.toUpperCase()}</span>
                <i className="bi bi-chevron-down text-base"></i>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-silver-200 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left cursor-pointer px-4 py-2 text-base hover:bg-silver-100 flex items-center space-x-2 ${
                        currentLanguage.code === lang.code 
                          ? 'text-[#083A85] bg-blue-50' 
                          : 'text-silver-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-xs text-silver-500">{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book a Tour Button - Prominent positioning */}
            <button 
              onClick={() => router.push('/all/tours')} 
              className="px-4 py-2 bg-[#F20C8F] text-white text-base font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer z-10 relative"
            >
              <i className="bi bi-binoculars mr-2"></i>
              {t('nav.findTour')}
            </button>

            {/* Become a Host Button */}
            <button 
              className="px-4 py-2 bg-[#F20C8F] text-white text-base font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300 cursor-pointer" 
              onClick={() => router.push('/all/become-host')}
            >
              <i className="bi bi-house-add mr-2"></i>
              {t('nav.becomeHost')}
            </button>

            {/* Profile Section */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-silver-300 animate-pulse"></div>
            ) : isLoggedIn && user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300 cursor-pointer ${
                    isScrolled
                      ? 'text-silver-700 hover:bg-silver-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#083A85] to-[#F20C8F] flex items-center justify-center">
                    {user.profile ? (
                      <img src={user.profile} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-white text-sm font-semibold">{getUserAvatar()}</span>
                    )}
                  </div>
                  <span className="text-base font-medium hidden lg:block">{getUserDisplayName()}</span>
                  <i className="bi bi-chevron-down text-base"></i>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-silver-200 py-1">
                    <div className="px-4 py-2 border-b border-silver-200">
                      <p className="text-sm font-semibold text-silver-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-silver-600">{user.email}</p>
                      <p className="text-xs text-silver-500 capitalize">{user.status} • {user.userType}</p>
                    </div>
                    <a href={`https://app.jambolush.com/all/${user.userType}?token=${userSession?.token}`} className="flex items-center px-4 py-2 text-base text-silver-700 hover:bg-silver-100">
                      <i className="bi bi-speedometer2 mr-3"></i>
                      {t('nav.dashboard')}
                    </a>
                    <a href={`https://app.jambolush.com/all/profile?token=${userSession?.token}`} className="flex items-center px-4 py-2 text-base text-silver-700 hover:bg-silver-100">
                      <i className="bi bi-person mr-3"></i>
                      {t('nav.profile')}
                    </a>
                    <a href={`https://app.jambolush.com/all/settings?token=${userSession?.token}`} className="flex items-center px-4 py-2 text-base text-silver-700 hover:bg-silver-100">
                      <i className="bi bi-gear mr-3"></i>
                      {t('nav.settings')}
                    </a>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-base text-red-600 hover:bg-red-50"
                    >
                      <i className="bi bi-box-arrow-right mr-3"></i>
                      {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {router.push('/all/login');}}
                  className={`px-4 py-2 text-base cursor-pointer font-medium rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-[#083A85] hover:bg-silver-100' 
                      : 'text-silver-300 hover:bg-white/10'
                  }`}
                >
                  {t('nav.signIn')}
                </button>
                <button
                  onClick={() => {router.push('/all/signup');}}
                  className="px-4 py-2 bg-[#083A85] text-white text-base cursor-pointer font-medium rounded-lg hover:bg-[#083A85]/90 transition-colors duration-300"
                >
                  {t('nav.signUp')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Book a Tour Mobile - First item for prominence */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push('/all/tours');
              }}
              className="w-full flex items-center px-2 py-1 bg-gradient-to-r from-[#083A85]/70 to-[#F20C8F] text-white text-sm font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <i className="bi bi-binoculars mr-2"></i>
              {t('nav.findTour')}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 cursor-pointer rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'text-silver-700 hover:bg-silver-100' 
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
            isScrolled ? 'border-silver-200 bg-white' : 'border-white/20 bg-black/20 backdrop-blur-sm'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">

              {/* Language Switcher Mobile */}
              <div className="relative" ref={mobileLangDropdownRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-silver-700 hover:bg-silver-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{getCurrentLanguage()?.flag}</span>
                    <span className="text-base font-medium">{getCurrentLanguage()?.nativeName}</span>
                  </div>
                  <i className="bi bi-chevron-down text-base"></i>
                </button>

                {isLangOpen && (
                  <div className="mt-1 ml-4 space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3 py-2 text-base rounded-lg transition-colors duration-300 flex items-center space-x-2 ${
                          currentLanguage.code === lang.code
                            ? 'text-[#083A85] bg-blue-50'
                            : isScrolled 
                            ? 'text-silver-600 hover:bg-silver-100' 
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <div className="flex flex-col">
                          <span className="font-medium">{lang.nativeName}</span>
                          <span className="text-xs opacity-75">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Become a Host Mobile */}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/all/become-host');
                }}
                className="w-full flex items-center px-3 py-2 bg-[#F20C8F] text-white text-base font-medium rounded-lg hover:bg-[#F20C8F]/90 transition-colors duration-300"
              >
                <i className="bi bi-house-add mr-2"></i>
                {t('nav.becomeHost')}
              </button>

              {/* Profile Section Mobile */}
              {isLoading ? (
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-silver-300 animate-pulse mr-3"></div>
                  <div className="h-4 bg-silver-300 rounded animate-pulse w-24"></div>
                </div>
              ) : isLoggedIn && user ? (
                <div className="space-y-1">
                  <div className={`flex items-center px-3 py-2 ${
                    isScrolled ? 'text-silver-700' : 'text-white'
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#083A85] to-[#F20C8F] flex items-center justify-center mr-3">
                      {user.profile ? (
                        <img src={user.profile} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-sm font-semibold">{getUserAvatar()}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs opacity-75">{user.email}</p>
                    </div>
                  </div>

                  <a href={`https://app.jambolush.com/all/${user.userType}?token=${userSession?.token}`} className={`flex items-center px-6 py-2 text-base rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-silver-600 hover:bg-silver-100' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}>
                    <i className="bi bi-speedometer2 mr-3"></i>
                    {t('nav.dashboard')}
                  </a>
                  <a href={`https://app.jambolush.com/all/profile?token=${userSession?.token}`} className={`flex items-center px-6 py-2 text-base rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-silver-600 hover:bg-silver-100' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}>
                    <i className="bi bi-person mr-3"></i>
                    {t('nav.profile')}
                  </a>

                  <a href={`https://app.jambolush.com/all/settings?token=${userSession?.token}`} className={`flex items-center px-6 py-2 text-base rounded-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-silver-600 hover:bg-silver-100' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}>
                    <i className="bi bi-gear mr-3"></i>
                    {t('nav.settings')}
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-6 py-2 text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                  >
                    <i className="bi bi-box-arrow-right mr-3"></i>
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/all/login');
                    }}
                    className={`w-full px-3 py-2 text-base font-medium rounded-lg transition-colors duration-300 text-center border border-silver-300 ${
                      isScrolled 
                        ? 'text-[#083A85] hover:bg-silver-100' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {t('nav.signIn')}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/all/signup'); 
                    }}
                    className="w-full px-3 py-2 bg-[#083A85] text-white text-base font-medium rounded-lg hover:bg-[#083A85]/90 transition-colors duration-300"
                  >
                    {t('nav.signUp')}
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