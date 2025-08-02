"use client";

import { useState, useRef } from 'react';

// Main Forgot Password Component
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [currentStep, setCurrentStep] = useState('email'); // 'email', 'otp', 'reset', 'success'
  const [loading, setLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120); // 2 minutes countdown
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const otpRefs = useRef<HTMLInputElement[]>([]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  const handleSendOtp = async () => {
    if (!isValidEmail) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep('otp');
      startOtpTimer();
    }, 2000);
  };

  const startOtpTimer = () => {
    setOtpTimer(120); // 2 minutes countdown
    setCanResendOtp(false);
    setIsOtpExpired(false);
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResendOtp(true);
          setIsOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    
    if (isOtpExpired) {
      alert('OTP has expired. Please request a new one.');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep('reset');
    }, 2000);
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8 || newPassword !== confirmPassword) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep('success');
    }, 2000);
  };

  const handleBackToLogin = () => {
    window.location.href = '/all/login';
  };

  const handleResendOtp = () => {
    if (!canResendOtp) return;
    setLoading(true);
    setOtp(['', '', '', '', '', '']); // Clear current OTP
    setTimeout(() => {
      setLoading(false);
      startOtpTimer();
    }, 1500);
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const isPasswordValid = newPassword.length >= 8 && newPassword === confirmPassword;

  // Success Step
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Password Reset Successful!</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleBackToLogin}
              className="w-full bg-gradient-to-r from-white to-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:from-gray-100 hover:to-white transition-all duration-300 transform hover:scale-[1.02]"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password Step
  if (currentStep === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Create New Password</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Enter your new password below. Make sure it's at least 8 characters long.
              </p>
            </div>

            <div className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-white/90 text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 8 characters)"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 focus:outline-none transition-colors duration-200"
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
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 focus:outline-none transition-colors duration-200"
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
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-300 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleResetPassword}
                disabled={!isPasswordValid || loading}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg transform ${
                  isPasswordValid && !loading
                    ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Step
  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Enter Verification Code</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                We've sent a 6-digit verification code to:
              </p>
              <p className="text-blue-300 font-medium mt-2">{email}</p>
            </div>

            <div className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium text-center">
                  Verification Code
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        if (el) otpRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isOtpExpired}
                      className={`w-12 h-12 text-center text-xl font-bold backdrop-blur-sm border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                        isOtpExpired 
                          ? 'bg-red-900/20 border-red-500/50 cursor-not-allowed opacity-50' 
                          : 'bg-white/10 border-white/30 focus:border-white/60 focus:ring-white/20 focus:bg-white/15'
                      }`}
                    />
                  ))}
                </div>
                {isOtpExpired && (
                  <p className="text-red-300 text-xs text-center mt-2">
                    ⚠️ This verification code has expired. Please request a new one.
                  </p>
                )}
              </div>

              {/* Timer and Resend */}
              <div className="text-center">
                {!canResendOtp ? (
                  <p className="text-white/60 text-sm">
                    {isOtpExpired ? (
                      <span className="text-red-300">Code expired • Request new code below</span>
                    ) : (
                      <>Code expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</>
                    )}
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors duration-200"
                  >
                    {loading ? 'Sending...' : 'Send New Code'}
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={!isOtpComplete || loading || isOtpExpired}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg transform ${
                  isOtpComplete && !loading && !isOtpExpired
                    ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : isOtpExpired ? (
                  'Code Expired'
                ) : (
                  'Verify Code'
                )}
              </button>

              {/* Back Button */}
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('email')}
                  className="group text-blue-300 text-sm hover:text-blue-200 font-medium transition-all duration-200 cursor-pointer relative"
                >
                  <span className="relative">← Change Email Address</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email Input Step (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              No worries! Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
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
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                  required
                />
                {email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidEmail ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {email && !isValidEmail && (
                <p className="text-red-300 text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!isValidEmail || loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg transform ${
                isValidEmail && !loading
                  ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white hover:scale-[1.02] hover:shadow-xl cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending Code...</span>
                </div>
              ) : (
                'Send Verification Code'
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="group text-blue-300 text-sm hover:text-blue-200 font-medium transition-all duration-200 cursor-pointer relative"
              >
                <span className="relative">← Back to Sign In</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-white/60 text-xs mb-2">
                Remember your password?
              </p>
              <button
                onClick={handleBackToLogin}
                className="text-blue-300 hover:text-blue-200 text-xs font-medium transition-colors duration-200"
              >
                Try signing in again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}