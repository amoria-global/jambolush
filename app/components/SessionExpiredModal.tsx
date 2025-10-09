"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/lib/LanguageContext";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose,
  redirectUrl,
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    // Store current URL for redirect after login
    const currentUrl = window.location.pathname + window.location.search;

    // Don't redirect if already on login page
    if (currentUrl.includes('/all/login')) {
      // Just close the modal and clear state
      onClose();
      setIsLoading(false);
      return;
    }

    const loginUrl = redirectUrl
      ? `/all/login?redirect=${encodeURIComponent(redirectUrl)}`
      : `/all/login?redirect=${encodeURIComponent(currentUrl)}`;

    // Clear any existing auth tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();

    // Close the modal FIRST to unblock the UI
    onClose();

    // Then redirect to login after a small delay
    setTimeout(() => {
      router.push(loginUrl);
    }, 100);
  };

  const handleClose = () => {
    // Clear tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();

    // Close modal FIRST to unblock the UI
    onClose();

    // Then redirect to home
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Non-clickable to prevent accidental dismissal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-md"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/50 to-white shadow-2xl border-2 border-blue-100">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-xl" />

                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                  >
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-800 text-center mb-3"
                  >
                    {t('auth.sessionExpired') || 'Session Expired'}
                  </motion.h2>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-center mb-8 leading-relaxed"
                  >
                    {t('auth.sessionExpiredMessage') ||
                      'Your session has expired for security reasons. Please log in again to continue.'}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    {/* Login button */}
                    <button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#083A85] to-[#083A85]/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          {t('auth.redirecting') || 'Redirecting...'}
                        </span>
                      ) : (
                        t('auth.loginAgain') || 'Log In Again'
                      )}
                    </button>

                    {/* Go Home button */}
                    <button
                      onClick={handleClose}
                      disabled={isLoading}
                      className="w-full py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('navigation.goHome') || 'Go to Home'}
                    </button>
                  </motion.div>

                  {/* Help text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-500 text-center mt-6"
                  >
                    {t('auth.needHelp') || 'Need help?'}{' '}
                    <a
                      href="/all/contact-support"
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      {t('navigation.contactSupport') || 'Contact Support'}
                    </a>
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionExpiredModal;
