'use client';

import React, { useEffect, useState } from 'react';
import { Ghost, ArrowLeft } from 'lucide-react';


const NotFoundPage = () => {
  // State to track if the component has mounted on the client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set isMounted to true after the component has mounted
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gray-900 text-gray-100">
      {/* Ghost icon with a subtle floating animation, applied only on the client */}
      <div className={isMounted ? "animate-bounce" : ""}>
        <Ghost size={120} className="text-gray-600 mb-6" />
      </div>

      {/* Main heading */}
      <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-4">
        404
      </h1>
      
      {/* Descriptive message */}
      <p className="text-lg md:text-2xl font-light text-gray-400 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Call-to-action button */}
      <a
        href="/"
        className="inline-flex items-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label="Go to Homepage"
      >
        <ArrowLeft size={20} />
        <span>Go to Homepage</span>
      </a>
    </div>
  );
};

export default NotFoundPage;
