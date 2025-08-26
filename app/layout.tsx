"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./styles/globals.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Preloader from "./components/Preloader"; // Import the Preloader component
import JambolushChatbot from "./components/chatbot"; // Corrected import path and casing

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // The pre-loader will be visible for 5 seconds

    return () => clearTimeout(timer);
  }, []);
  
  // Define routes where navbar should be hidden
  const hideNavbarRoutes = ["/all/login", "/all/signup", "/all/forgotpw"];
  
  // Check if current path should hide navbar
  const shouldHideNavbarFooter = hideNavbarRoutes.includes(pathname);
  
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
            {!shouldHideNavbarFooter && <Footer />}
            {!shouldHideNavbarFooter && <JambolushChatbot />} {/* Add this line */}
          </>
        )}
      </body>
    </html>
  );
}