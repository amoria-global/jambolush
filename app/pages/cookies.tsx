"use client";
import React, { useState } from "react";

const CookiesConsent = () => {
  const [activeTab, setActiveTab] = useState<"cookies" | "privacy">("cookies");
  const [strictlyNecessary, setStrictlyNecessary] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Enable all cookies
  const handleEnableAll = () => {
    setStrictlyNecessary(true);
    setAnalytics(true);
    setMarketing(true);
  };

  // Save settings (simulate with console.log + close banner)
  const handleSaveSettings = () => {
    console.log("Cookie Preferences Saved:", {
      strictlyNecessary,
      analytics,
      marketing,
    });
    setShowBanner(false);
  };

  // Agree and Close (Enable all + close banner)
  const handleAgreeAndClose = () => {
    handleEnableAll();
    // Also log the action for simulation purposes
    console.log("Agreed to all cookies and closed banner.");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    // MODIFIED: Container is now a full-screen overlay that positions the banner at the bottom.
    <div className="fixed inset-0 flex items-end justify-center bg-opacity-60 backdrop-blur-sm z-50 p-4">
      {/* The banner content itself remains the same */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-4 sm:p-6">
        {/* Simplified the top bar text */}
        <div className="flex justify-between items-center border-b pb-3">
          <p className="text-gray-800 text-sm sm:text-base flex items-center gap-2">
            <i className="bi bi-cookie text-pink-600 text-lg"></i>
            We use cookies to improve your experience. You can customize your settings below.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "cookies"
                ? "border-b-2 border-pink-600 text-pink-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("cookies")}
          >
            Manage Cookies
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "privacy"
                ? "border-b-2 border-pink-600 text-pink-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy Overview
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "cookies" ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Cookie Preferences</h3>
              <p className="text-gray-600 text-sm mb-4">
                These cookies should always be enabled so that we can save your preferences.
              </p>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Toggle
                  label="Strictly Necessary"
                  enabled={strictlyNecessary}
                  setEnabled={setStrictlyNecessary}
                />
                <Toggle
                  label="Analytics Cookies"
                  enabled={analytics}
                  setEnabled={setAnalytics}
                />
                <Toggle
                  label="Marketing Cookies"
                  enabled={marketing}
                  setEnabled={setMarketing}
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Privacy Overview</h3>
              <p className="text-gray-600 text-sm mb-3">
                This website uses cookies to provide you with the best user experience. Cookies help recognize you when you return and allow us to understand which sections are most useful.{" "}
                <a
                  href="/all/privacy-policy"
                  className="text-pink-600 underline cursor-pointer"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Updated button layout and styles */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={handleEnableAll}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition"
          >
            Enable All
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 transition"
          >
            Save Settings
          </button>
          <button
            onClick={handleAgreeAndClose}
            className="px-6 py-2 rounded-xl bg-pink-600 text-white shadow-lg hover:bg-pink-700 transition font-semibold"
          >
            Agree and Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Toggle Component (No changes needed)
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
            if (label !== "Strictly Necessary") {
                setEnabled(!enabled)
            }
        }}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-pink-600" : "bg-gray-300"
        } ${label === "Strictly Necessary" ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={label === "Strictly Necessary"}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default CookiesConsent;