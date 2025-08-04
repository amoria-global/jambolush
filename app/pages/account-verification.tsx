'use client';
import React, { useState } from 'react';

const AccountVerificationPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResendEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setEmailSent(true);
      setLoading(false);
      // In a real app, you would make a fetch call here
      // to your backend to resend the email.
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gray-900 text-gray-100">
      <div className="p-10 rounded-3xl shadow-2xl bg-gray-800 max-w-md w-full border border-gray-700">
        <div className="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-indigo-400" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Verify Your Account
        </h1>
        <p className="text-base md:text-lg text-gray-400 mb-6">
          We have sent a verification email to your address. Please check your inbox and click the link to activate your account.
        </p>
        {emailSent && (
          <div className="flex items-center justify-center text-green-400 mb-4 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <span>Verification email resent!</span>
          </div>
        )}
        <div className="flex flex-col space-y-4 mt-6">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
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
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-full text-gray-300 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationPage;