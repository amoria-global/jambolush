"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button if user has scrolled more than 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  };

  return (
    <>
      {isVisible && (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-24 right-4 p-7 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-110 z-50 flex items-center justify-center w-12 h-12 cursor-pointer" >
            <i className="bi bi-arrow-up text-xl"></i>
        </button>

      )}
    </>
  );
}