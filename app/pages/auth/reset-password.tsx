"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../api/apiService';
import AlertNotification from '@/app/components/notify';

export default function ResetPasswordPage() {
  // Router
  const router = useRouter();
  
  // State management for the form
  const [currentStep, setCurrentStep] = useState('otp'); // 'otp', 'reset', 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI and validation state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notify, setNotify] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);

  // OTP timer state
  const [otpTimer, setOtpTimer] = useState(120);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  
  // URL parameters state
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);
  
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // Get URL parameters on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setUrlParams(params);
    }
  }, []);

  // Get email and other params from URL on component mount
  useEffect(() => {
    if (!urlParams) return; // Wait for URL params to be loaded
    
    const emailParam = urlParams.get('email');
    const stepParam = urlParams.get('step');
    const otpParam = urlParams.get('otp');
    
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    // If OTP is provided in URL, skip to reset step
    if (otpParam && otpParam.length === 6) {
      setOtp(otpParam.split(''));
      setCurrentStep('reset');
    } else if (stepParam === 'reset') {
      setCurrentStep('reset');
    }
    
    // Start OTP timer if we're on OTP step
    if (currentStep === 'otp') {
      startOtpTimer();
    }
  }, [urlParams, currentStep]);

  // Helper function to get URL parameter
  const getUrlParam = (key: string): string | null => {
    if (!urlParams) return null;
    return urlParams.get(key);
  };

  const handleNotificationClose = () => {
    setNotify(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    // Move focus to the next input field
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };
  
  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move focus to the previous input field on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(80);
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

  const handleResendOtp = async () => {
    if (!canResendOtp || loading || !email) return;

    setLoading(true);
    setNotify(null);
    setOtp(['', '', '', '', '', '']);

    try {
      await api.post('/auth/forgot-password', { email });
      setNotify({type: "success", message: "New verification code sent to your email."});
      startOtpTimer();
    } catch (err: any) {
      setNotify({type: "error", message: err.data?.message || 'Failed to resend OTP. Please try again later.'});
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || loading) return;
    
    if (isOtpExpired) {
      setNotify({type: "error", message: "OTP has expired. Please request a new one."});
      return;
    }

    setLoading(true);
    setNotify(null);

    try {
      await api.post('/auth/verify-otp', { email, otp: otpValue });
      setCurrentStep('reset');
      setNotify({type: "success", message: "Code verified successfully!"});
    } catch (err: any) {
      setNotify({type: "error", message: err.data?.message || 'Invalid OTP. Please check the code and try again.'});
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid || loading) return;

    setLoading(true);
    setNotify(null);

    try {
      const otpValue = otp.join('');
      await api.post('/auth/reset-password', {
        email,
        otp: otpValue,
        newPassword,
      });
      setCurrentStep('success');
    } catch (err: any) {
      setNotify({type: "error", message: err.data?.message || 'Failed to reset password. The verification may have expired.'});
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    const redirect = getUrlParam('redirect') || getUrlParam('returnUrl') || getUrlParam('return_to');
    if (redirect) {
      router.push(`/all/login?redirect=${encodeURIComponent(redirect)}`);
    } else {
      router.push('/all/login');
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const isPasswordValid = newPassword.length >= 8 && newPassword === confirmPassword;

  // Success step
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4">
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
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Password Set Successfully!</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Your password has been successfully set. You can now sign in with your new credentials.
              </p>
            </div>
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

  // Reset password step
  if (currentStep === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4">
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
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Set Your Password</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Create a secure password for your account. Make sure it's at least 8 characters long.
              </p>
              {email && (
                <p className="text-blue-300 text-sm mt-2 font-medium">
                  {email}
                </p>
              )}
            </div>
            <div className="space-y-6">
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
                {newPassword && newPassword.length < 8 && (
                  <p className="text-yellow-300 text-xs mt-1">Password must be at least 8 characters long</p>
                )}
              </div>
              
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
                    <span>Setting Password...</span>
                  </div>
                ) : (
                  'Set Password'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP verification step (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#0B1426] flex items-center justify-center p-4">
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
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Enter Verification Code</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Please enter the 6-digit verification code that was sent to your email to reset your password.
            </p>
            {email && (
              <p className="text-blue-300 font-medium mt-2">{email}</p>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium text-center">
                Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { if (el) otpRefs.current[index] = el; }}
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
            
            <div className="text-center">
              <button
                onClick={handleBackToLogin}
                className="group text-blue-300 text-sm hover:text-blue-200 font-medium transition-all duration-200 cursor-pointer relative"
              >
                <span className="relative">← Back to Sign In</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}