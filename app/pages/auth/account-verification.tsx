'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/apiService'; // Import your API service
import PasswordChangeModal from './password-change'; // Import the modal
import AlertNotification from '@/app/components/notify';

const AccountVerificationPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [isApplicationFlow, setIsApplicationFlow] = useState(false);
  const [notify, setNotify] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);
  
  // URL parameters state
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);
  
  const router = useRouter();

  // Get URL parameters on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setUrlParams(params);
    }
  }, []);

  // Check if user came from application or login
  useEffect(() => {
    if (!urlParams) return; // Wait for URL params to be loaded
    
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    const pendingUserType = localStorage.getItem('pendingUserType');
    const pendingAppId = localStorage.getItem('pendingApplicationId');
    const isApplication = urlParams.get('application') === 'true';
    const urlUserType = urlParams.get('type');
    
    if (pendingEmail) {
      setUserEmail(pendingEmail);
    }
    
    if (pendingUserType || urlUserType) {
      setUserType(pendingUserType || urlUserType || '');
    }
    
    if (pendingAppId) {
      setApplicationId(pendingAppId);
    }
    
    if (isApplication) {
      setIsApplicationFlow(true);
    }

    // Check if verification was completed via URL parameters
    const verified = urlParams.get('verified');
    const token = urlParams.get('token') || localStorage.getItem('authToken');
    
    if (verified === 'true' || token) {
      handleVerificationComplete();
    }
  }, [urlParams]);

  // Function to handle notification close
  const handleNotificationClose = () => {
    setNotify(null);
  };

  // Helper function to get URL parameter
  const getUrlParam = (key: string): string | null => {
    if (!urlParams) return null;
    return urlParams.get(key);
  };

  // Helper function to handle redirects after password setup
  const getRedirectUrl = (token?: string) => {
    const redirect = getUrlParam('redirect') || getUrlParam('returnUrl') || getUrlParam('return_to');
    
    if (redirect) {
      try {
        const decodedRedirect = decodeURIComponent(redirect);
        const url = new URL(decodedRedirect, window.location.origin);
        
        if (url.origin === window.location.origin) {
          if (token) {
            url.searchParams.set('token', token);
          }
          return url.toString();
        }
        
        const trustedDomains = [
          'localhost:3001',
          'localhost:3000',
          'https://app.jambolush.com',
          'https://jambolush.com',
          'http://jambolush.com'
        ];
        
        if (trustedDomains.some(domain => url.host === domain)) {
          if (token) {
            url.searchParams.set('token', token);
          }
          return url.toString();
        }
        
        console.warn('Redirect to untrusted domain blocked:', url.origin);
      } catch (error) {
        console.warn('Invalid redirect URL:', redirect, error);
      }
    }
    
    // Default redirect based on context
    if (isApplicationFlow) {
      // For applications, redirect to a welcome/onboarding page
      return token ? `https://app.jambolush.com?token=${token}&type=${userType}` : '/welcome';
    }
    
    // For regular login flow
    return token ? `https://app.jambolush.com?token=${token}` : 'https://app.jambolush.com';
  };

  const performRedirect = (token?: string) => {
    const redirectUrl = getRedirectUrl(token);
    
    try {
      const url = new URL(redirectUrl);
      if (url.origin !== window.location.origin) {
        window.location.href = redirectUrl;
        return;
      }
    } catch (error) {
      // If URL parsing fails, treat as internal redirect
    }
    
    const path = redirectUrl.replace(window.location.origin, '');
    router.push(path);
  };

  const handleResendEmail = async () => {
    setLoading(true);
    
    try {
      if (userEmail) {
        // Use appropriate endpoint based on context
        const endpoint = isApplicationFlow ? '/auth/resend-verification' : '/auth/forgot-password';
        await api.post(endpoint, { email: userEmail });
        setEmailSent(true);
        setNotify({type: "success", message: "Verification email resent successfully!"});
      } else {
        setEmailSent(true);
        setNotify({type: "info", message: "If you have an account, a verification email has been sent."});
      }
    } catch (error: any) {
      console.error('Resend email error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.data?.message ||
                          'Failed to resend email. Please try again.';
      setNotify({type: "error", message: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    setVerificationComplete(true);
    const successMessage = isApplicationFlow 
      ? "Email verified successfully! Please set up your password to activate your account."
      : "Email verified successfully! Please set up your password.";
    
    setNotify({type: "success", message: successMessage});
    
    // Show password modal after a short delay
    setTimeout(() => {
      setShowPasswordModal(true);
    }, 1500);
  };

  const handlePasswordSetSuccess = () => {
    const successMessage = isApplicationFlow
      ? "Password set successfully! Your account is now active. Welcome to JamboLush!"
      : "Password set successfully! Redirecting...";
    
    setNotify({type: "success", message: successMessage});
    
    // Clear stored data
    localStorage.removeItem('pendingVerificationEmail');
    localStorage.removeItem('pendingUserType');
    localStorage.removeItem('pendingApplicationId');
    
    // Redirect after password is set
    setTimeout(() => {
      performRedirect();
    }, 2500);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    
    const warningMessage = isApplicationFlow
      ? "You can complete your account setup anytime by clicking the button below."
      : "You can set your password anytime by clicking the button below.";
    
    setNotify({type: "warning", message: warningMessage});
  };

  // Get role-specific content
  const getRoleInfo = () => {
    switch (userType) {
      case 'host':
        return {
          title: 'Property Owner',
          description: 'You can start listing your properties once your account is fully activated.',
          icon: 'bi bi-house-door'
        };
      case 'agent':
        return {
          title: 'Field Agent',
          description: 'You can start helping clients find properties once your account is fully activated.',
          icon: 'bi bi-people'
        };
      case 'tourguide':
        return {
          title: 'Tour Guide',
          description: 'You can start offering guided tours once your account is fully activated.',
          icon: 'bi bi-geo-alt'
        };
      default:
        return {
          title: 'User',
          description: 'Complete your account setup to get started.',
          icon: 'bi bi-person-circle'
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gradient-to-br from-[#0B1426] via-[#0F1B35] to-[#083A85] text-gray-100">
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

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={handlePasswordModalClose}
        onSuccess={handlePasswordSetSuccess}
      />

      <div className="p-10 rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl border border-white/20 max-w-md w-full">
        <div className="flex justify-center mb-6">
          {verificationComplete ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-green-400" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-indigo-400" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
            </svg>
          )}
        </div>
        
        <h1 className="text-3xl md:text-2xl font-extrabold text-white mb-4">
          {verificationComplete ? 'Email Verified!' : 
           isApplicationFlow ? 'Application Submitted!' : 'Verify Your Account'}
        </h1>
        
        <p className="text-base md:text-lg text-white/70 mb-6">
          {verificationComplete 
            ? (isApplicationFlow 
                ? `Your email has been verified successfully. Please set up your password to activate your ${roleInfo.title.toLowerCase()} account.`
                : 'Your email has been verified successfully. Please set up your password to complete the process.')
            : (isApplicationFlow
                ? `Thank you for applying as a ${roleInfo.title}! We have sent a verification email to complete your account setup.`
                : 'We have sent a verification email to your address. Please check your inbox and click the link to activate your account.')
          }
        </p>

        {/* Application/Role Info */}
        {isApplicationFlow && userType && (
          <div className="mb-4 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <i className={`${roleInfo.icon} text-blue-300 text-xl`}></i>
              <h3 className="text-blue-200 font-medium">{roleInfo.title} Application</h3>
            </div>
            <p className="text-blue-200/80 text-sm">
              {roleInfo.description}
            </p>
          </div>
        )}

        {/* User Email Display */}
        {userEmail && (
          <div className="mb-4 p-3 bg-gray-500/20 backdrop-blur-sm border border-gray-400/30 rounded-lg">
            <p className="text-gray-200 text-sm">
              <span className="font-medium">Email:</span> {userEmail}
            </p>
            {applicationId && (
              <p className="text-gray-200/80 text-xs mt-1">
                <span className="font-medium">Application ID:</span> {applicationId}
              </p>
            )}
          </div>
        )}

        {emailSent && !verificationComplete && (
          <div className="flex items-center justify-center text-green-400 mb-4 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <span>Verification email resent!</span>
          </div>
        )}

        <div className="flex flex-col space-y-4 mt-6">
          {verificationComplete ? (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center cursor-pointer justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#083A85] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <span>Set Up Password</span>
            </button>
          ) : (
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="inline-flex items-center cursor-pointer justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#083A85] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
              )}
              <span>{loading ? 'Resending...' : 'Resend Email'}</span>
            </button>
          )}
          
          <a
            href={`https://app.jambolush.com?token=${getUrlParam('token') || ''}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-base font-medium rounded-full text-white/90 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Go to Dashboard
          </a>
        </div>

        {/* Redirect info if present */}
        {urlParams && getUrlParam('redirect') && (
          <div className="mt-4 p-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg">
            <p className="text-blue-200 text-sm">
              <span className="font-medium">You'll be redirected after setup</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountVerificationPage;