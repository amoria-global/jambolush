'use client';

import React from 'react';
import Link from 'next/link';

const ExploreMorePage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans px-4 md:px-12 py-12">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-[#0C2D62] mb-4">Explore More with JAMBOLUSH</h1>
        <p className="max-w-xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Discover unique spaces and opportunities for productivity, creativity, and collaboration. 
          Learn how our platform can help you find the perfect environment to thrive.
        </p>
      </header>

      {/* Featured Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Flexible Spaces</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4">
            Our spaces are designed to adapt to your needs, whether you are working solo, collaborating with a team, or hosting an event.
          </p>
          <Link href="/all/discover-how" className="text-[#F20C8F] text-sm md:text-base font-semibold hover:underline">
            Discover how →
          </Link>
        </div>
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src="https://media.istockphoto.com/id/2193122069/photo/close-up-of-a-new-shoot-of-plant-in-dry-cracked-clay-mud-in-dried-up-lake-bed-riverbed-during.jpg?s=612x612&w=0&k=20&c=VdhJkil7SMv9pfGAVst9QRrVO4o8SL7qNBD77HQhB_E="
            alt="Flexible Spaces"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:flex-row-reverse">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Inspiring Environments</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4">
            We carefully curate spaces that foster creativity, collaboration, and focus. Every environment is optimized for productivity.
          </p>
          <Link href="/all/learn-more" className="text-[#F20C8F] text-sm md:text-base font-semibold hover:underline">
            Learn more →
          </Link>
        </div>
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1581309553233-a6d8e331c921?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5zcGlyaW5nJTIwZW52aXJvbm1lbnR8ZW58MHx8MHx8fDA%3D"
            alt="Inspiring Environments"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      <section className="text-center py-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Connect with like-minded individuals, explore new spaces, and maximize your potential. Become part of the JAMBOLUSH family today.
        </p>
        <Link 
          href="/all/contact-us" 
          className="bg-pink-600 text-white px-6 py-3 rounded-md text-sm md:text-base font-medium hover:bg-pink-700"
        >
          Contact Us
        </Link>
      </section>
    </main>
  );
};

export default ExploreMorePage;
