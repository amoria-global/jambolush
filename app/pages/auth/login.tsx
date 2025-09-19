"use client";

import api from '@/app/api/apiService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import AlertNotification from '@/app/components/notify'; // Update this import path

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "739960680632-g75378et3hgeu5qmukdqp8085369gh1t.apps.googleusercontent.com";

// Declare Google types
declare global {
  interface Window {
    google: any;
  }
}

// Loading component for Suspense fallback
function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#083A85] flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4"></div>
        <div className="h-4 bg-white/20 rounded w-32 mx-auto mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-24 mx-auto"></div>
      </div>
    </div>
  );
}

// Main Login Component (without useSearchParams)
function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [notify, setNotify] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
  ];

  const getCurrentLanguage = () => languages.find(lang => lang.code === currentLang);

  const handleNotificationClose = () => {
    setNotify(null);
  };

  const getRedirectUrl = (token?: string, refreshToken?: string) => {
    const redirect = searchParams.get('redirect') || searchParams.get('returnUrl') || searchParams.get('return_to');
    
    if (redirect) {
      try {
        const decodedRedirect = decodeURIComponent(redirect);
        const url = new URL(decodedRedirect, window.location.origin);
        
        const trustedDomains = [
          'localhost:3001',
          'localhost:3000',
          'https://app.jambolush.com',
          'https://jambolush.com',
          'http://jambolush.com'
        ];
        
        if (url.origin === window.location.origin || trustedDomains.some(domain => url.host === domain)) {
          if (token) {
            url.searchParams.set('token', token);
            url.searchParams.set('refresh_token', refreshToken || '');
          }
          return url.toString();
        }
        
        console.warn('Redirect to untrusted domain blocked:', url.origin);
      } catch (error) {
        console.warn('Invalid redirect URL:', redirect, error);
      }
    }
    
    return token ? `http://localhost:3001?token=${token}&refresh_token=${refreshToken}` : 'https://app.jambolush.com';
  };

  const performRedirect = (token?: string, refreshToken?: string, redirectPath?: string) => {
    const redirectUrl = redirectPath || getRedirectUrl(token, refreshToken);
    
    try {
      const url = new URL(redirectUrl, window.location.origin);
      if (url.origin !== window.location.origin) {
        window.location.href = redirectUrl;
        return;
      }
    } catch (error) {
      console.error("Invalid URL for redirection:", error);
    }
    
    router.push(redirectUrl);
  };

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        }
      };
    };

    loadGoogleScript();

    return () => {
      const scripts = document.querySelectorAll('script[src="https://accounts.google.com/gsi/client"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  const handleGoogleCallback = async (response: any) => {
    setGoogleLoading(true);
    
    try {
      const result = await api.post('/auth/google', { token: response.credential });
      const token = result.data?.token || result.data?.accessToken;
      const refreshToken = result.data.refreshToken;
      
      if (token) {
        localStorage.setItem('authToken', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        const userData = result.data?.user || result.data;
        const userStatus = userData?.status;
        
        if (userStatus === 'active') {
          setNotify({type: "success", message: "Successfully signed in with Google! Redirecting..."});
        } else {
          setNotify({type: "success", message: "Successfully signed in with Google! Pending verification."});
        }
        
        setTimeout(() => {
          handleUserRedirect(userData, token, refreshToken);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      let errorMessage = "Google authentication failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      if (errorMessage.includes('Please set up your password first') || errorMessage.includes('Check your email for instructions')) {
        try {
          const tokenData = JSON.parse(atob(response.credential.split('.')[1]));
          if (tokenData.email) {
            localStorage.setItem('pendingVerificationEmail', tokenData.email);
          }
        } catch (e) {
          console.log('Could not extract email from Google token');
        }
        setNotify({type: "info", message: "Please check your email to set up your password first."});
        setTimeout(() => {
          const currentRedirect = searchParams.get('redirect') || searchParams.get('returnUrl') || searchParams.get('return_to');
          const verificationUrl = currentRedirect ? `/all/account-verification?redirect=${encodeURIComponent(currentRedirect)}` : '/all/account-verification';
          router.push(verificationUrl);
        }, 2000);
      } else {
        setNotify({type: "error", message: errorMessage});
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const googleLoginDiv = document.createElement('div');
          document.body.appendChild(googleLoginDiv);
          window.google.accounts.id.renderButton(googleLoginDiv, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            click_listener: () => {},
          });
          const googleButton = googleLoginDiv.querySelector('[role="button"]') as HTMLElement;
          if (googleButton) {
            googleButton.click();
          }
          setTimeout(() => {
            document.body.removeChild(googleLoginDiv);
          }, 100);
        }
      });
    }
  };

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsFormValid(emailRegex.test(email) && password.length >= 6);
  }, [email, password]);

  useEffect(() => {
    if (!isLangOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangOpen]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // UPDATED handleUserRedirect function
  const handleUserRedirect = (userData: any, token?: string, refreshToken?: string) => {
    const userRole = userData?.role || userData?.user?.role;
    const userStatus = userData?.status || userData?.user?.status;
    const verificationStatus = userData?.verificationStatus;
    const isVerified = userData?.isVerified;

    // Condition 1: Success Login (verified and active)
    if (userStatus === 'active' && verificationStatus === 'verified') {
      setNotify({ type: "success", message: "Login successful! Redirecting to dashboard..." });
      setTimeout(() => {
        performRedirect(token, refreshToken);
      }, 1500);
      return;
    }

    // Condition 2: Verified but not active -> Redirect to set password
    if (verificationStatus === 'verified' && userStatus !== 'active') {
      setNotify({ type: "info", message: "Account verified but not active. Please set your password." });
      setTimeout(() => {
        performRedirect(token, refreshToken, '/all/set-password');
      }, 1500);
      return;
    }

    // Condition 3: Not verified and any status
    if (verificationStatus !== 'verified') {
      const dashboardBase = 'http://localhost:3001';

      switch (userRole) {
        case 'host':
          setNotify({ type: "warning", message: "Please complete your KYC verification." });
          performRedirect(token, refreshToken, `${dashboardBase}/all/kyc`);
          break;
        case 'agent':
        case 'tourguide':
          if (!isVerified) {
            setNotify({ type: "info", message: "Please complete your assessments." });
            performRedirect(token, refreshToken, `${dashboardBase}/all/${userRole}/assessment`);
          } else {
            setNotify({ type: "warning", message: "Please complete your KYC verification." });
            performRedirect(token, refreshToken, `${dashboardBase}/all/kyc`);
          }
          break;
        case 'guest':
          setNotify({ type: "info", message: "Please verify your account to continue." });
          performRedirect(token, refreshToken, `/all/account-verification`);
          break;
        default:
          // Handles 'admin' and any other unverified roles
          setNotify({ type: "error", message: "Access denied. Account is not active or verified." });
          break;
      }
      return;
    }

    // All other cases (e.g., pending, suspended, inactive, or unhandled roles/statuses)
    setNotify({ type: "error", message: "Access denied. Your account is not in a valid state." });
    setTimeout(() => {
      router.push('/all/contact-support');
    }, 2000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) {
      setNotify({type: "warning", message: "Please enter a valid email and password (minimum 6 characters)."});
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const accessToken = response.data?.accessToken || response.data?.token;
      const refreshToken = response.data?.refreshToken;
      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }
      const userData = response.data?.user || response.data;
      handleUserRedirect(userData, accessToken, refreshToken);
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.data?.message || 'Login failed. Please try again.';
      if (errorMessage.includes('Please set up your password first') || errorMessage.includes('Check your email for instructions')) {
        localStorage.setItem('pendingVerificationEmail', email);
        setNotify({type: "info", message: "Please check your email to set up your password first."});
        setTimeout(() => {
          const currentRedirect = searchParams.get('redirect') || searchParams.get('returnUrl') || searchParams.get('return_to');
          const verificationUrl = currentRedirect ? `/all/account-verification?redirect=${encodeURIComponent(currentRedirect)}` : '/all/account-verification';
          router.push(verificationUrl);
        }, 2000);
      } else {
        setNotify({type: "error", message: errorMessage});
      }
    } finally {
      setLoading(false);
    }
  };

  const redirectInfo = searchParams.get('redirect') || searchParams.get('returnUrl') || searchParams.get('return_to');
  
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#083A85] flex flex-col relative">
        {notify && (
          <AlertNotification
            message={notify.message}
            type={notify.type}
            position="top-center"
            duration={5000}
            size="md"
            showProgress={true}
            autoHide={true}
            onClose={handleNotificationClose}
          />
        )}
        <div ref={langDropdownRef} className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <span className="text-sm">{getCurrentLanguage()?.flag}</span>
            <span className="text-xs font-medium">{getCurrentLanguage()?.code.toUpperCase()}</span>
            <svg className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isLangOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setIsLangOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/20 flex items-center space-x-2 transition-colors duration-200"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pt-12 pb-6 px-6 text-center">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
              <img 
                src="/favicon.ico" 
                alt="JamboLush Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">
            Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Unique</span>
          </h1>
          <h2 className="text-white/90 text-2xl font-bold mb-2">
            Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Inspired</span>
          </h2>
          <p className="text-white/60 text-xs px-4">
            Discover extraordinary places and create unforgettable memories
          </p>
          
          {redirectInfo && (
            <div className="mt-3 mx-4">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-3 py-2">
                <p className="text-blue-200 text-xs">
                  <span className="font-medium">Redirecting after login</span>
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-t-3xl border-t border-white/20 px-6 pt-6 overflow-y-auto">
          <div className="max-w-sm mx-auto">
            <h3 className="text-white text-lg font-bold mb-1 text-center">Welcome Back</h3>
            <p className="text-white/70 text-xs mb-6 text-center">Sign in to your account to continue</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-white/90 text-xs font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password-mobile" className="block text-white/90 text-xs font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password-mobile"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 pr-10 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-mobile"
                    className="w-3.5 h-3.5 text-blue-400 bg-white/10 border-white/30 rounded focus:ring-blue-400 focus:ring-1"
                  />
                  <label htmlFor="remember-mobile" className="ml-1.5 text-white/80">
                    Remember me
                  </label>
                </div>
                <a href="/all/forgotpw" className="text-blue-300 hover:text-blue-200">
                  Forgot password?
                </a>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  isFormValid && !loading
                    ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <div className="text-center text-xs">
                <span className="text-white/70">Don't have an account? </span>
                <a href="/all/signup" className="text-blue-300 hover:text-blue-200 font-medium">
                  Create one
                </a>
              </div>
              <div className="relative my-4">
                <div className="flex items-center">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-3 text-white/60 text-xs">Or continue with</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleGoogleSignIn} 
                disabled={googleLoading}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg flex items-center justify-center space-x-3 transition-all duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            </div>
            <div className="pb-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex font-['Inter',sans-serif] antialiased overflow-hidden">
      {notify && (
        <AlertNotification
          message={notify.message}
          type={notify.type}
          position="top-center"
          duration={5000}
          size="md"
          showProgress={true}
          autoHide={true}
          onClose={handleNotificationClose}
        />
      )}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-6 left-6 z-20">
          <div ref={langDropdownRef} className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <span className="text-base">{getCurrentLanguage()?.flag}</span>
              <span className="text-base font-medium">{getCurrentLanguage()?.code.toUpperCase()}</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isLangOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left cursor-pointer px-4 py-2 text-base text-white hover:bg-white/20 flex items-center space-x-2 transition-colors duration-200"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-24 h-24 border border-white/20 rotate-45"></div>
          <div className="absolute bottom-32 right-24 w-20 h-20 border border-white/10 rotate-12"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white/15 -rotate-45"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="mb-8 relative">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
              <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center relative z-10 drop-shadow-2xl overflow-hidden">
                <img 
                  src="/favicon.ico" 
                  alt="JamboLush Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-white text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Unique</span>.
            </h1>
            <h2 className="text-white/90 text-3xl lg:text-4xl font-bold tracking-tight">
              Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Inspired</span>.
            </h2>
            <p className="text-white/60 text-sm lg:text-base mt-4 max-w-sm mx-auto leading-relaxed">
              Discover extraordinary places and create unforgettable memories with our curated selection of unique accommodations.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-gradient-to-bl from-[#083A85] via-[#0A4694] to-[#083A85] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-24 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-24 left-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="md:hidden absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <span className="text-sm">{getCurrentLanguage()?.flag}</span>
            <span className="text-xs font-medium">{getCurrentLanguage()?.code.toUpperCase()}</span>
            <svg className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isLangOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setIsLangOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/20 flex items-center space-x-2 transition-colors duration-200"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-full max-w-md relative z-10">
          <div className="md:hidden text-center mb-6">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                <img 
                  src="/favicon.ico" 
                  alt="JamboLush Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-white text-xl font-bold">JamboLush</h1>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl">
            <div className="text-center mb-6 lg:mb-8">
              <h3 className="text-white text-xl lg:text-2xl font-bold mb-2">Welcome Back</h3>
              <p className="text-white/70 text-sm lg:text-base">Sign in to your account to continue</p>
              
              {redirectInfo && (
                <div className="mt-4">
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-2">
                    <p className="text-blue-200 text-sm">
                      <span className="font-medium">Redirecting after login</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
              <div className="space-y-2">
                <label htmlFor="email-desktop" className="block text-white/90 text-sm lg:text-base font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email-desktop"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 lg:py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300 text-sm lg:text-base"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password-desktop" className="block text-white/90 text-sm lg:text-base font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password-desktop"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 lg:py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300 text-sm lg:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 focus:outline-none transition-colors duration-200 cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-desktop"
                    name="remember"
                    className="w-4 h-4 text-blue-400 bg-white/10 border-white/30 rounded focus:ring-blue-400 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="remember-desktop" className="ml-2 text-white/80 text-sm lg:text-base cursor-pointer select-none">
                    Remember me
                  </label>
                </div>
                <a 
                  href="/all/forgotpw" 
                  className="group text-blue-300 text-sm lg:text-base hover:text-blue-200 transition-all duration-200 cursor-pointer relative"
                >
                  <span className="relative">Forgot password?</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
                </a>
              </div>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-2.5 lg:py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg transform text-sm lg:text-base ${
                  isFormValid && !loading
                    ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <div className="text-center mt-5">
              <span className="text-white/70 text-sm lg:text-base">Don't have an account? </span>
              <a 
                href="/all/signup" 
                className="group text-blue-300 text-sm lg:text-base hover:text-blue-200 font-medium transition-all duration-200 cursor-pointer relative"
              >
                <span className="relative">Create one</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>
            <div className="relative my-5 lg:my-6">
              <div className="flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-white/60 text-sm lg:text-base">
                  Or continue with
                </span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              disabled={googleLoading}
              aria-label="Sign in with Google" 
              className="group w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 py-2.5 lg:py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}