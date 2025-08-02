"use client";

import { useState, useEffect } from 'react';

// Google Auth Page Component
function GoogleAuthPage({ onBack, onSuccess }: { onBack: () => void; onSuccess: (provider: string, userData: any) => void }) {
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess('google', { email, provider: 'Google' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create your Google Account' : 'Sign in with Google'}
            </h2>
            <p className="text-gray-600">Use your Google account to continue to JamboLush</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating Account...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors duration-200"
            >
              ← Back to JamboLush
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Apple Auth Page Component
function AppleAuthPage({ onBack, onSuccess }: { onBack: () => void; onSuccess: (provider: string, userData: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess('apple', { email, provider: 'Apple' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-black rounded-full shadow-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Create Apple ID' : 'Sign in with Apple ID'}
            </h2>
            <p className="text-gray-400">Use your Apple ID to continue to JamboLush</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Apple ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Apple ID"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={loading || !email || !password}
              className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating Account...' : (isSignUp ? 'Create Apple ID' : 'Sign In')}
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                {isSignUp ? 'Already have an Apple ID? Sign in' : "Don't have an Apple ID? Create one"}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <button
              onClick={onBack}
              className="w-full text-gray-400 hover:text-gray-200 py-2 text-sm font-medium transition-colors duration-200"
            >
              ← Back to JamboLush
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Facebook Auth Page Component
function FacebookAuthPage({ onBack, onSuccess }: { onBack: () => void; onSuccess: (provider: string, userData: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess('facebook', { email, provider: 'Facebook' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-[#1877F2] rounded-full shadow-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Facebook Account' : 'Log in to Facebook'}
            </h2>
            <p className="text-gray-600">Connect with friends and the world around you on Facebook</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email or phone number</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={loading || !email || !password}
              className="w-full bg-[#1877F2] text-white py-3 rounded-lg font-medium hover:bg-[#166FE5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating Account...' : (isSignUp ? 'Sign Up' : 'Log In')}
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#1877F2] hover:text-[#166FE5] text-sm font-medium"
              >
                {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors duration-200"
            >
              ← Back to JamboLush
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success Page Component
function SuccessPage({ provider, userData, onContinue }: { provider?: string | undefined; userData: any; onContinue: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to JamboLush!</h2>
          <p className="text-gray-600 mb-6">
            Successfully created your account{provider ? ` with ${provider}` : ''}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Account created for:</p>
            <p className="font-medium text-gray-900">{userData.email}</p>
          </div>
          
          <button
            onClick={onContinue}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to JamboLush
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Signup Page Component
function SignupPage({ onSocialLogin }: { onSocialLogin: (provider: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isFormValid) {
      console.log('Creating account with:', { firstName, lastName, email, password });
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif] antialiased">
      {/* Left Side - Brand Section */}
      <div className="flex-1 bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4 min-h-screen relative overflow-hidden">
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
                {/* Option 1: Replace with your image */}
                <img 
                  src="/favicon.ico" 
                  alt="JamboLush Logo" 
                  className="w-full h-full object-cover"
                />
                
                {/* Option 2: Keep text as fallback (comment out the img above and uncomment this) */}
                {/* <span className="text-white text-4xl font-bold">JL</span> */}
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
      <div className="flex-1 bg-gradient-to-bl from-[#083A85] via-[#0A4694] to-[#083A85] flex items-center justify-center p-4 min-h-screen relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-24 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-24 left-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-white text-2xl font-bold mb-2">Create Account</h3>
              <p className="text-white/70 text-sm">Join JamboLush and start your adventure</p>
            </div>

            <div className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-white/90 text-sm font-medium">
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
                  <label htmlFor="lastName" className="block text-white/90 text-sm font-medium">
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
                <label htmlFor="email" className="block text-white/90 text-sm font-medium">
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

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white/90 text-sm font-medium">
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
                <label htmlFor="confirmPassword" className="block text-white/90 text-sm font-medium">
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
                  <p className="text-red-300 text-xs mt-1">Passwords do not match</p>
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
                <label htmlFor="terms" className="text-white/80 text-sm cursor-pointer select-none leading-relaxed">
                  I agree to the{' '}
                  <button className="text-blue-300 hover:text-blue-200 underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className="text-blue-300 hover:text-blue-200 underline">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg transform ${
                  isFormValid
                    ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                }`}
              >
                Create Account
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <span className="text-white/70 text-sm">Already have an account? </span>
                <a 
                  href="/all/login" 
                  className="group text-blue-300 text-sm hover:text-blue-200 font-medium transition-all duration-200 cursor-pointer relative"
                >
                  <span className="relative">Sign in</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
                </a>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="flex items-center">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-4 text-white/60 text-sm">
                    Or sign up with
                  </span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => onSocialLogin('google')}
                  aria-label="Sign up with Google"
                  className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 py-3 px-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => onSocialLogin('apple')}
                  aria-label="Sign up with Apple"
                  className="group bg-black hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white py-3 px-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={() => onSocialLogin('facebook')}
                  aria-label="Sign up with Facebook"
                  className="group bg-[#1877F2] border border-[#1877F2] text-white py-3 px-3 rounded-xl font-medium hover:bg-[#166FE5] hover:border-[#166FE5] transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Signup App Component - matches the structure of your login page
export default function SignupApp() {
  const [currentPage, setCurrentPage] = useState('signup');
  const [authData, setAuthData] = useState<{ email: string; provider: string } | null>(null);

  const handleSocialLogin = (provider: string) => {
    setCurrentPage(provider);
  };

  const handleBack = () => {
    setCurrentPage('signup');
  };

  const handleAuthSuccess = (provider: string, userData: any) => {
    setAuthData(userData);
    setCurrentPage('success');
  };

  const handleContinue = () => {
    alert('Redirecting to JamboLush dashboard...');
  };

  switch (currentPage) {
    case 'google':
      return <GoogleAuthPage onBack={handleBack} onSuccess={handleAuthSuccess} />;
    case 'apple':
      return <AppleAuthPage onBack={handleBack} onSuccess={handleAuthSuccess} />;
    case 'facebook':
      return <FacebookAuthPage onBack={handleBack} onSuccess={handleAuthSuccess} />;
    case 'success':
      return <SuccessPage provider={authData?.provider} userData={authData} onContinue={handleContinue} />;
    default:
      return <SignupPage onSocialLogin={handleSocialLogin} />;
  }
}