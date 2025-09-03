"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./styles/globals.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Preloader from "./components/Preloader";
import JambolushChatbot from "./components/chatbot";
import CookiesConsent from "./pages/cookies"; // Your cookies modal component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  useEffect(() => {
    // Check if we're on the homepage
    const isHomepage = pathname === "/";
    
    // Check if preloader has been shown in this session
    const hasShownPreloader = sessionStorage.getItem("preloaderShown");
    
    // Show preloader only if it's homepage and hasn't been shown yet
    if (isHomepage && !hasShownPreloader) {
      setLoading(true);
      
      const timer = setTimeout(() => {
        setLoading(false);
        // Mark preloader as shown in this session
        sessionStorage.setItem("preloaderShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    // Network connectivity detection
    const handleOnline = () => {
      setIsOffline(false);
      setLoading(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setLoading(true);
    };

    // Check initial network status
    setIsOffline(!navigator.onLine);

    // Add event listeners for network status changes
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check if user navigated directly to /all/cookies and show modal
  useEffect(() => {
    if (pathname === "/all/cookies") {
      setShowCookieModal(true);
    }
  }, [pathname]);

  // Define routes where navbar should be hidden
  const hideNavbarRoutes = ["/all/login", "/all/signup", "/all/forgotpw"];
  
  // Check if current path should hide navbar
  const shouldHideNavbarFooter = hideNavbarRoutes.includes(pathname);
  
  // Function to open cookie modal (passed to Footer)
  const openCookieModal = () => {
    setShowCookieModal(true);
  };

  // Function to close cookie modal
  const closeCookieModal = () => {
    setShowCookieModal(false);
    // If user navigated directly to /all/cookies, redirect them back
    if (pathname === "/all/cookies") {
      window.history.back();
    }
  };
  
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        {loading ? (
          <Preloader />
        ) : (
          <>
            {!shouldHideNavbarFooter && <Navbar />}
            {children}
            {!shouldHideNavbarFooter && <Footer onOpenCookieModal={openCookieModal} />}
            {!shouldHideNavbarFooter && <JambolushChatbot />}
            
            {/* Cookie Modal Overlay */}
            {showCookieModal && (
              <CookiesConsent onClose={closeCookieModal} />
            )}
          </>
        )}
      </body>
    </html>
  );
}