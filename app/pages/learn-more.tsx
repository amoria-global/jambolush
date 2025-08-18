'use client';

import React from 'react';
import Link from 'next/link';

const LearnMorePage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans px-4 md:px-12 py-12">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-[#0C2D62] mb-4">Learn More</h1>
        <p className="max-w-xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Dive deeper into the features, benefits, and unique aspects of JAMBOLUSH. Gain insights on how we empower individuals and businesses.
        </p>
      </header>

      {/* Feature Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Flexible Solutions</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4">
            Learn how our platform provides adaptable solutions for work and living spaces that cater to evolving needs.
          </p>
          <Link href="/all/discover-how" className="text-[#F20C8F] text-sm md:text-base font-semibold hover:underline">
            Discover how →
          </Link>
        </div>
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src="https://media.istockphoto.com/id/2193122069/photo/close-up-of-a-new-shoot-of-plant-in-dry-cracked-clay-mud-in-dried-up-lake-bed-riverbed-during.jpg?s=612x612&w=0&k=20&c=VdhJkil7SMv9pfGAVst9QRrVO4o8SL7qNBD77HQhB_E="
            alt="Flexible Solutions"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Inspiring Spaces Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:flex-row-reverse">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Inspiring Environments</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4">
            We carefully curate spaces that foster creativity, collaboration, and focus. Every environment is optimized for productivity.
          </p>
          <Link href="/all/explore-more" className="text-[#F20C8F] text-sm md:text-base font-semibold hover:underline">
            Explore more →
          </Link>
        </div>
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1710279749852-bae70877e5d2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Inspiring Environments"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Call To Action */}
      <section className="text-center py-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Stay Informed</h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Keep up to date with our latest updates, features, and tips to get the most out of JAMBOLUSH.
        </p>
        <Link href="/all/contact-us" className="bg-pink-600 text-white px-6 py-3 rounded-md text-sm md:text-base font-medium hover:bg-pink-700">
          Contact Us
        </Link>
      </section>
    </main>
  );
};

export default LearnMorePage;
