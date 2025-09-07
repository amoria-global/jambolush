"use client";

import api from '@/app/api/api-conn';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import AlertNotification from '@/app/components/notify'; // Update this import path

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "739960680632-g75378et3hgeu5qmukdqp8085369gh1t.apps.googleusercontent.com";

// Main Signup Page Component
function SignupPage({ 
  isLangOpen, 
  setIsLangOpen, 
  currentLang, 
  setCurrentLang, 
  languages, 
  getCurrentLanguage 
}: { 
  isLangOpen: boolean;
  setIsLangOpen: (open: boolean) => void;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  languages: Array<{code: string, name: string, flag: string}>;
  getCurrentLanguage: () => any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize Google Sign-In
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

  // Handle Google OAuth callback
  const handleGoogleCallback = async (response: any) => {
    setGoogleLoading(true);
    
    try {
      // The response contains the ID token from Google
      const result = await api.post('/auth/google', {
        token: response.credential,
      });

      // Success - store token and redirect
      if (result.data?.accessToken) {
        localStorage.setItem('authToken', result.data.accessToken);
        if (result.data.refreshToken) {
          localStorage.setItem('refreshToken', result.data.refreshToken);
        }
        setNotify({type: "success", message: "Successfully signed up with Google!"});
        setTimeout(() => router.push('https://app.jambolush.com?token=' + result.data.accessToken), 2000); // Delay to show success message
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      
      if (error.data?.message) {
        setNotify({type: "error", message: error.data.message});
      } else if (error.status === 409) {
        setNotify({type: "error", message: "An account with this email already exists."});
      } else {
        setNotify({type: "error", message: "Failed to sign up with Google. Please try again."});
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Trigger Google Sign-In
  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If the prompt can't be displayed, try the popup method
          const googleLoginDiv = document.createElement('div');
          document.body.appendChild(googleLoginDiv);
          
          window.google.accounts.id.renderButton(googleLoginDiv, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            click_listener: () => {},
          });
          
          // Programmatically click the rendered button
          const googleButton = googleLoginDiv.querySelector('[role="button"]') as HTMLElement;
          if (googleButton) {
            googleButton.click();
          }
          
          // Clean up
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
  }, [isLangOpen, setIsLangOpen]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = 
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      emailRegex.test(email) &&
      password.length >= 8 &&
      password === confirmPassword &&
      agreeToTerms;
    setIsFormValid(isValid);
  }, [firstName, lastName, email, password, confirmPassword, agreeToTerms]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!isFormValid) {
      setNotify({type: "warning", message: "Please fill in all required fields correctly."});
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
        provider: 'manual',
        phoneCountryCode: country ? getCountryCode(country) : 'US',
        country: country || undefined,
        userType: 'admin'
      });

      // Check if the response indicates an error even if it didn't throw
      if (response.status && response.status >= 400) {
        throw {
          status: response.status,
          data: response.data
        };
      }

      // Check if response data contains error indicators
      if (response.data?.message === 'User already exists' || 
          response.data?.error || 
          (response.data?.message && !response.data?.accessToken)) {
        throw {
          status: 409,
          data: response.data
        };
      }

      // Success case - only if we have a valid response
      if (response.data?.accessToken || response.status === 200 || response.status === 201) {
        setNotify({type: "success", message: "Registration successful! Redirecting to login..."});
        setTimeout(() => router.push('/all/login'), 2000);
      } else {
        // Unexpected response format
        throw {
          status: response.status || 500,
          data: response.data || { message: "Unexpected response format" }
        };
      }

    } catch (error: any) {
      console.log("Full error object:", error);

      if (error.status) {
        const { status, data } = error;
        
        if (data?.message) {
          setNotify({type: "error", message: data.message});
        } else if (data?.error) {
          setNotify({type: "error", message: data.error});
        } else if (data?.errors && Array.isArray(data.errors)) {
          setNotify({type: "error", message: data.errors.join(', ')});
        } else if (data?.details) {
          setNotify({type: "warning", message: data.details});
        } else if (typeof data === 'string') {
          setNotify({type: "error", message: data});
        } else {
          switch (status) {
            case 400:
              setNotify({type: "error", message: "Invalid registration data. Please check your inputs."});
              break;
            case 409:
              setNotify({type: "error", message: "Email already exists. Please use a different email."});
              break;
            case 422:
              setNotify({type: "error", message: "Registration data is invalid. Please check all fields."});
              break;
            case 500:
              setNotify({type: "error", message: "Server error. Please try again later."});
              break;
            default:
              setNotify({type: "error", message: `Registration failed (Error ${status}). Please try again.`});
          }
        }
      } else if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        setNotify({type: "error", message: "Request timed out. Please try again."});
      } else {
        const errorMessage = error.message || "Registration failed. Please try again.";
        setNotify({type: "error", message: errorMessage});
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get country code from country name
  const getCountryCode = (countryName: string): string => {
    const countryCodes: { [key: string]: string } = {
      'United States': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Spain': 'ES',
      'Italy': 'IT',
      'Japan': 'JP',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'Rwanda': 'RW',
      'Kenya': 'KE',
      'South Africa': 'ZA',
      'Nigeria': 'NG',
      // Add more countries as needed
    };
    return countryCodes[countryName] || 'US';
  };

  // Function to handle notification close
  const handleNotificationClose = () => {
    setNotify(null);
  };

  if (isMobileView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#083A85] flex flex-col relative font-['Inter',sans-serif] antialiased">
        {/* Alert Notifications */}
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

        {/* Language Selector - Mobile */}
        <div ref={langDropdownRef} className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <span className="text-base">{getCurrentLanguage()?.flag}</span>
            <span className="text-base font-medium">{getCurrentLanguage()?.code.toUpperCase()}</span>
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
                  className="w-full text-left px-3 py-2 text-base text-white hover:bg-white/20 flex items-center space-x-2 transition-colors duration-200"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Header */}
        <div className="pt-12 pb-6 px-6 text-center">
            <div className="inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                    <img src="/favicon.ico" alt="JamboLush Logo" className="w-full h-full object-cover"/>
                </div>
            </div>
            <h1 className="text-white text-2xl font-bold mb-1">
                Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Your Journey</span>
            </h1>
            <h2 className="text-white/90 text-2xl font-bold mb-2">
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Memories</span>
            </h2>
        </div>

        {/* Mobile Form */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-t-3xl border-t border-white/20 px-6 pt-6 overflow-y-auto">
            <div className="max-w-sm mx-auto">
                <h3 className="text-white text-lg font-bold mb-1 text-center">Create Account</h3>
                <p className="text-white/70 text-base mb-6 text-center">Join JamboLush and start your adventure</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/90 text-base font-medium mb-1.5">First Name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full px-3 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-base" required />
                        </div>
                        <div>
                            <label className="block text-white/90 text-base font-medium mb-1.5">Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full px-3 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-base" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-white/90 text-base font-medium mb-1.5">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-3 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-base" required />
                    </div>
                    <div>
                        <label className="block text-white/90 text-base font-medium mb-1.5">Phone Number (Optional)</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" className="w-full px-3 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-base" />
                    </div>
                    <div>
                        <label className="block text-white/90 text-base font-medium mb-1.5">Country (Optional)</label>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter your country" className="w-full px-3 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-base" />
                    </div>
                    <div>
                        <label className="block text-white/90 text-base font-medium mb-1.5">Password</label>
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full px-3 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-base" required />
                    </div>
                    <div>
                        <label className="block text-white/90 text-base font-medium mb-1.5">Confirm Password</label>
                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full px-3 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 text-base" required />
                         {password && confirmPassword && password !== confirmPassword && (
                            <p className="text-red-300 text-base mt-1">Passwords do not match</p>
                        )}
                    </div>
                    <div className="flex items-start space-x-2">
                        <input type="checkbox" id="terms-mobile" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="w-3.5 h-3.5 mt-0.5 text-blue-400 bg-white/10 border-white/30 rounded focus:ring-blue-400 focus:ring-1" />
                        <label htmlFor="terms-mobile" className="text-white/80 text-base">I agree to the <button className="text-blue-300 underline">Terms</button> & <button className="text-blue-300 underline">Policy</button></label>
                    </div>
                    <button type="button" onClick={handleSubmit} disabled={!isFormValid || loading} className={`w-full py-2.5 px-4 rounded-lg font-semibold text-base transition-all duration-300 ${ isFormValid && !loading ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800' : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' }`}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <div className="text-center text-base">
                      <span className="text-white/70">Already have an account? </span>
                      <a href="/all/login" className="text-blue-300 hover:text-blue-200 font-medium">Sign in</a>
                    </div>
                    <div className="text-center text-base">
                      <span className="text-white/70">Want to become a service provider? </span>
                      <a href="/become-host" className="text-blue-300 hover:text-blue-200 font-medium">Join as Host</a>
                    </div>
                    <div className="relative my-4">
                      <div className="flex items-center">
                        <div className="flex-1 border-t border-white/20"></div>
                        <span className="px-3 text-white/60 text-base">Or sign up with</span>
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
                        <span className="font-medium">{googleLoading ? 'Signing up...' : 'Sign up with Google'}</span>
                    </button>
                </div>
                <div className="pb-20"></div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif] antialiased">
      {/* Alert Notifications */}
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

      {/* Left Side - Brand Section */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] items-center justify-center p-4 min-h-screen relative overflow-hidden">
        
        {/* Language Dropdown - Top Left */}
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
              <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center relative z-10 drop-shadow-2xl overflow-hidden">
                <img 
                  src="/favicon.ico" 
                  alt="JamboLush Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-white text-4xl font-bold tracking-tight leading-tight">
              Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Your Journey</span>.
            </h1>
            <h2 className="text-white/90 text-4xl font-bold tracking-tight">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Memories</span>.
            </h2>
            <p className="text-white/60 text-base mt-4 max-w-sm mx-auto leading-relaxed">
              Join thousands of travelers who trust JamboLush to discover extraordinary places and create unforgettable experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 bg-gradient-to-bl from-[#083A85] via-[#0A4694] to-[#083A85] flex items-center justify-center p-4 min-h-screen relative overflow-y-auto">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-24 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-24 left-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10 py-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-white text-2xl font-bold mb-2">Create Account</h3>
              <p className="text-white/70 text-base">Join JamboLush and start your adventure</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-white/90 text-base font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-white/90 text-base font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-white/90 text-base font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Phone Field (Optional) */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-white/90 text-base font-medium">
                  Phone Number <span className="text-white/60">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Country Field (Optional) */}
              <div className="space-y-2">
                <label htmlFor="country" className="block text-white/90 text-base font-medium">
                  Country <span className="text-white/60">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter your country"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white/90 text-base font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 8 characters)"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-white/90 text-base font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 focus:outline-none transition-colors duration-200 cursor-pointer"
                  >
                    {showConfirmPassword ? (
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
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-300 text-base mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-blue-400 bg-white/10 border-white/30 rounded focus:ring-blue-400 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="terms" className="text-white/80 text-base cursor-pointer select-none leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-blue-300 hover:text-blue-200 underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-300 hover:text-blue-200 underline">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg transform ${
                  isFormValid && !loading
                    ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                }`}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
              
            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-white/70 text-base">Already have an account? </span>
              <a 
                href="/all/login" 
                className="group text-blue-300 text-base hover:text-blue-200 font-medium transition-all duration-200 cursor-pointer relative"
              >
                <span className="relative">Sign in</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>

            {/* Become Host Link */}
            <div className="text-center mt-3">
              <span className="text-white/70 text-base">Want to become a service provider? </span>
              <a 
                href="/hosts/become" 
                className="group text-blue-300 text-base hover:text-blue-200 font-medium transition-all duration-200 cursor-pointer relative"
              >
                <span className="relative">Join as Host</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-white/60 text-base">
                  Or sign up with
                </span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button 
              type="button" 
              onClick={handleGoogleSignIn} 
              disabled={googleLoading}
              aria-label="Sign up with Google" 
              className="group w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{googleLoading ? 'Signing up...' : 'Sign up with Google'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Declare Google types
declare global {
  interface Window {
    google: any;
  }
}

// Main Signup App Component
export default function SignupApp() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

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
    <>
      <SignupPage 
        isLangOpen={isLangOpen}
        setIsLangOpen={setIsLangOpen}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        languages={languages}
        getCurrentLanguage={getCurrentLanguage}
      />
    </>
  );
}