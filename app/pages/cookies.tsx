"use client";
import React, { useState } from "react";

const CookiesConsent = () => {
  const [activeTab, setActiveTab] = useState<"cookies" | "privacy">("cookies");
  const [strictlyNecessary, setStrictlyNecessary] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showModal, setShowModal] = useState(true);

  // Enable all cookies
  const handleEnableAll = () => {
    setStrictlyNecessary(true);
    setAnalytics(true);
    setMarketing(true);
  };

  // Save settings (simulate with console.log + close modal)
  const handleSaveSettings = () => {
    console.log("Cookie Preferences Saved:", {
      strictlyNecessary,
      analytics,
      marketing,
    });
    setShowModal(false);
  };

  // Agree and Close (Enable all + close modal)
  const handleAgreeAndClose = () => {
    handleEnableAll();
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    // Overlay
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 backdrop-blur-sm z-50 p-4">
      {/* Container */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-4 sm:p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center border-b pb-3">
          <p className="text-gray-700 text-sm sm:text-base flex items-center gap-2">
            <i className="bi bi-cookie text-pink-600 text-lg"></i>
            We use cookies to improve your experience. See{" "}
            <span className="font-semibold cursor-pointer">settings</span>.
          </p>
          <button
            onClick={handleAgreeAndClose}
            className="px-2 py-1 rounded-xl bg-pink-600 text-white shadow hover:bg-pink-700 transition cursor-pointer"
          >
            Agree and Close
          </button>
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
            Strictly Necessary Cookies
          </button>
          <button className={`px-4 py-2 text-sm font-medium ${activeTab === "privacy"? "border-b-2 border-pink-600 text-pink-600"
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
              <h3 className="text-lg font-semibold mb-2">Strictly Necessary Cookies</h3>
              <p className="text-gray-600 text-sm mb-4">These cookies should always be enabled so that we can save your preferences.</p>
              
              {/* Strictly Necessary */}
              <Toggle
                label="Strictly Necessary"
                enabled={strictlyNecessary}
                setEnabled={setStrictlyNecessary}
              />
              {/* Analytics */}
              <Toggle
                label="Analytics Cookies"
                enabled={analytics}
                setEnabled={setAnalytics}
              />
              {/* Marketing */}
              <Toggle
                label="Marketing Cookies"
                enabled={marketing}
                setEnabled={setMarketing}
              />

            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Privacy Overview</h3>
              <p className="text-gray-600 text-sm mb-3">
                This website uses cookies to provide you with the best user
                experience. Cookies help recognize you when you return and allow
                us to understand which sections are most useful.{" "}
                <a href="/all/privacy-policy"className="text-pink-600 underline cursor-pointer">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleEnableAll}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 shadow hover:bg-gray-200 transition cursor-pointer"
          >
            Enable All
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-xl bg-pink-600 text-white shadow hover:bg-pink-700 transition cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Toggle Component
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
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-pink-600" : "bg-gray-300"
        }`}
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
