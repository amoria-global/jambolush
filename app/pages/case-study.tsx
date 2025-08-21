'use client';

import React from 'react';
import Link from 'next/link';

const CaseStudyPage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans px-4 md:px-12 py-12">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-[#0C2D62] mb-4">Case Studies</h1>
        <p className="max-w-xl mx-auto text-gray-600 text-sm md:text-base leading-relaxed">
          Explore real-life examples of how JAMBOLUSH has transformed work and living environments for individuals, teams, and businesses.
        </p>
      </header>

      {/* Case Study Item */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop"
            alt="Startup Workspace"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Startup Workspace Transformation</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4">
            We helped a tech startup redesign their office layout for productivity and collaboration. With JAMBOLUSH, they found flexible spaces that adapted to their growth.
          </p>
          <Link href="/all/learn-more" className="text-[#F20C8F] text-sm md:text-base font-semibold hover:underline">
            Learn more →
          </Link>
        </div>
      </section>

      {/* Call To Action */}
      <section className="text-center py-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Want to See More?</h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Check out our detailed case studies to understand how JAMBOLUSH supports different industries and teams.
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

export default CaseStudyPage;
