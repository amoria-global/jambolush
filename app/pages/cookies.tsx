"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from '@/app/lib/LanguageContext';

interface CookiesConsentProps {
  onClose?: () => void;
}

const CookiesConsent = ({ onClose }: CookiesConsentProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"cookies" | "privacy">("cookies");
  const [strictlyNecessary, setStrictlyNecessary] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Load existing cookie preferences if they exist
  useEffect(() => {
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (cookieChoice) {
      try {
        const settings = JSON.parse(cookieChoice);
        setStrictlyNecessary(settings.strictlyNecessary ?? true);
        setAnalytics(settings.analytics ?? false);
        setMarketing(settings.marketing ?? false);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      // Store original styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      
      // Apply modal styles
      document.body.style.overflow = 'hidden';
      
      // Cleanup function
      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow || '';
        document.body.style.position = originalPosition || '';
      };
    }
  }, [isVisible]);

  // Additional cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Ensure styles are reset when component unmounts
      document.body.style.overflow = '';
      document.body.style.position = '';
    };
  }, []);

  // Enable all cookies
  const handleEnableAll = () => {
    setStrictlyNecessary(true);
    setAnalytics(true);
    setMarketing(true);
  };

  // Save settings (simulate with console.log + close banner)
  const handleSaveSettings = () => {
    const cookieSettings = {
      strictlyNecessary,
      analytics,
      marketing,
    };
    console.log("Cookie Preferences Saved:", cookieSettings);
    localStorage.setItem('cookieConsent', JSON.stringify(cookieSettings));
    closeModal();
  };

  // Agree and Close (Enable all + close banner)
  const handleAgreeAndClose = () => {
    handleEnableAll();
    const cookieSettings = {
      strictlyNecessary: true,
      analytics: true,
      marketing: true,
    };
    console.log("Agreed to all cookies and closed banner.");
    localStorage.setItem('cookieConsent', JSON.stringify(cookieSettings));
    closeModal();
  };

  // Close modal
  const closeModal = () => {
    setIsVisible(false);
    
    // Immediately restore body styles to ensure page is scrollable
    document.body.style.overflow = '';
    document.body.style.position = '';
    
    // Call parent onClose callback if provided
    if (onClose) {
      onClose();
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Don't render anything if modal should not show
  if (!isVisible) return null;

  return (
    // Portal-like overlay that sits on top of everything
    <div 
      className="fixed inset-0 flex items-center justify-center bg-white/5 backdrop-blur-xs z-[9999] p-4"
      onClick={handleBackdropClick}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {/* Modal container */}
      <div 
        className="bg-gray-200 w-[60%] h-[60%] max-w-6xl max-h-[80vh] min-w-[320px] min-h-[400px] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close button with red hover */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer"
          aria-label="Close modal"
        >
          <i className="bi bi-x text-xl"></i>
        </button>

        {/* Header - maintaining original simple style */}
        <div className="flex justify-between items-center border-b p-4 sm:p-6 pr-16">
          <p className="text-gray-800 text-base sm:text-base flex items-center gap-2">
            <i className="bi bi-cookie text-pink-600 text-lg"></i>
            {t('cookies.message')}
          </p>
        </div>

        {/* Content area - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Tabs - maintaining original styling */}
          <div className="flex gap-2 mt-4 px-4 sm:px-6 border-b">
            <button
              className={`px-4 py-2 text-base font-medium cursor-pointer transition-colors ${
                activeTab === "cookies"
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("cookies")}
            >
              {t('cookies.manageCookies')}
            </button>
            <button
              className={`px-4 py-2 text-base font-medium cursor-pointer transition-colors ${
                activeTab === "privacy"
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("privacy")}
            >
              {t('cookies.privacyOverview')}
            </button>
          </div>

          {/* Tab Content - maintaining original structure */}
          <div className="mt-4 p-4 sm:p-6">
            {activeTab === "cookies" ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('cookies.cookiePreferences')}</h3>
                <p className="text-gray-600 text-base mb-4">
                  {t('cookies.preferenceDescription')}
                </p>

                {/* Toggles - maintaining original grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Toggle
                    label={t('cookies.strictlyNecessary')}
                    enabled={strictlyNecessary}
                    setEnabled={setStrictlyNecessary}
                  />
                  <Toggle
                    label={t('cookies.analyticsCookies')}
                    enabled={analytics}
                    setEnabled={setAnalytics}
                  />
                  <Toggle
                    label={t('cookies.marketingCookies')}
                    enabled={marketing}
                    setEnabled={setMarketing}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('cookies.privacyOverview')}</h3>
                <p className="text-gray-600 text-base mb-3">
                  {t('cookies.privacyDescription')}{
                  <a
                    href="/all/privacy-policy"
                    className="text-pink-600 underline cursor-pointer hover:text-pink-700 transition-colors"
                  >
                    {t('cookies.privacyPolicy')}
                  </a>
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - maintaining original button layout and styles */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-4 p-4 sm:p-6">
          <button
            onClick={handleEnableAll}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition cursor-pointer"
          >
            {t('cookies.enableAll')}
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 transition cursor-pointer"
          >
            {t('cookies.saveSettings')}
          </button>
          <button
            onClick={handleAgreeAndClose}
            className="px-6 py-2 rounded-xl bg-pink-600 text-white shadow-lg hover:bg-pink-700 transition font-semibold cursor-pointer"
          >
            {t('cookies.agreeAndClose')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Toggle Component - maintaining original styling with cursor-pointer added
const Toggle = ({
  label,
  enabled,
  setEnabled,
}: {
  label: string;
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-3 mb-2 p-2 rounded-lg bg-gray-50">
      <button
        onClick={() => {
            // Strictly Necessary cookies cannot be disabled
            if (!label.includes("Strictly") && !label.includes("Necesario") && !label.includes("Nécessaire")) {
                setEnabled(!enabled)
            }
        }}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-pink-600" : "bg-gray-300"
        } ${label === "Strictly Necessary" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        disabled={label === "Strictly Necessary"}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-base font-medium">{label}</span>
    </div>
  );
};

export default CookiesConsent;