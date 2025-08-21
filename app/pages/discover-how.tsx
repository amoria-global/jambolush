'use client';

import React from 'react';
import Link from 'next/link';

const DiscoverHowPage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans px-4 md:px-12 py-12">
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-[#0C2D62] mb-4">
        Discover How JAMBOLUSH Works
      </h1>

      {/* Intro paragraph */}
      <p className="text-gray-600 text-sm md:text-base mb-6">
        Learn step by step how JAMBOLUSH connects people to opportunities,
        providing seamless booking, trust, and flexibility for everyone.
      </p>

      {/* Sections */}
      <div className="space-y-8">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-[#0C2D62] mb-2">
            1. Browse Listings
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore a variety of options tailored to your needs, from cozy rooms
            to spacious properties.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-[#0C2D62] mb-2">
            2. Connect Instantly
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Contact property owners directly through our secure messaging
            system.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-[#0C2D62] mb-2">
            3. Book with Confidence
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Enjoy secure transactions and transparent booking terms for peace of
            mind.
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-10">
        <Link
          href="/all/explore-more"
          className="inline-block bg-[#F20C8F] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#d10b7c] transition"
        >
          Explore More →
        </Link>
      </div>
    </main>
  );
};

export default DiscoverHowPage;
