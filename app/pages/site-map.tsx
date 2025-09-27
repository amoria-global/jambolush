"use client";

import React from "react";
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";

const SitemapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl px-4 md:px-12 py-13">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 mt-6 text-center">
          <i className="bi bi-sitemap mr-2"></i>
          Sitemap
        </h1>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">

          {/* Home / Company */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-house-door-fill text-pink-500 mr-2"></i>
              Home
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="/" className="hover:text-blue-900">Main Page</Link></li>
              <li><Link href="/all/about" className="hover:text-blue-900">About Us</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Careers</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Press</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Blog</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Investors</Link></li>
            </ul>
          </div>

          {/* Account / User */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-person-fill text-pink-500 mr-2"></i>
              Account
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="/" className="hover:text-blue-900">Login</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Sign Up</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Profile</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Trips</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Wishlist</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Gift Cards</Link></li>
              <li><Link href="/" className="hover:text-blue-900">Refer a Friend</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-geo-alt-fill text-pink-500 mr-2"></i>
              Destinations
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">USA</Link></li>
              <li><Link href="" className="hover:text-blue-900">Europe</Link></li>
              <li><Link href="" className="hover:text-blue-900">Asia</Link></li>
              <li><Link href="" className="hover:text-blue-900">Africa</Link></li>
              <li><Link href="" className="hover:text-blue-900">Oceania</Link></li>
              <li><Link href="" className="hover:text-blue-900">South America</Link></li>
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-calendar-event-fill text-pink-500 mr-2"></i>
              Experiences
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">Online Experiences</Link></li>
              <li><Link href="" className="hover:text-blue-900">Local Experiences</Link></li>
              <li><Link href="" className="hover:text-blue-900">Adventure</Link></li>
              <li><Link href="" className="hover:text-blue-900">Culture</Link></li>
              <li><Link href="" className="hover:text-blue-900">Food & Drink</Link></li>
            </ul>
          </div>

          {/* Support / Community */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-question-circle-fill text-pink-500 mr-2"></i>
              Support & Community
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">Help Center</Link></li>
              <li><Link href="" className="hover:text-blue-900">FAQ</Link></li>
              <li><Link href="" className="hover:text-blue-900">Contact Support</Link></li>
              <li><Link href="" className="hover:text-blue-900">Safety</Link></li>
              <li><Link href="" className="hover:text-blue-900">Community Guidelines</Link></li>
              <li><Link href="" className="hover:text-blue-900">Partners</Link></li>
              <li><Link href="" className="hover:text-blue-900">Sustainability / ESG</Link></li>
            </ul>
          </div>

          {/* Policies / Legal */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-shield-lock-fill text-pink-500 mr-2"></i>
                 Policies & Legal
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">Terms & Conditions</Link></li>
              <li><Link href="" className="hover:text-blue-900">Privacy Policy</Link></li>
              <li><Link href="" className="hover:text-blue-900">Cookies Policy</Link></li>
              <li><Link href="" className="hover:text-blue-900">Refund Policy</Link></li>
              <li><Link href="" className="hover:text-blue-900">Cancellation Policy</Link></li>
              <li><Link href="" className="hover:text-blue-900">Compliance</Link></li>
              <li><Link href="" className="hover:text-blue-900">Disclaimer</Link></li>

            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-building text-pink-500 mr-2"></i>
              Hosting
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">Become a Host</Link></li>
              <li><Link href="" className="hover:text-blue-900">Hosting Tools</Link></li>
              <li><Link href="" className="hover:text-blue-900">Resources</Link></li>
              <li><Link href="" className="hover:text-blue-900">Host Safety</Link></li>
              <li><Link href="" className="hover:text-blue-900">Hosting Standards</Link></li>
              <li><Link href="" className="hover:text-blue-900">Experiences for Work</Link></li>
            </ul>
          </div>

          {/* Mobile Apps */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-phone-fill text-pink-500 mr-2"></i>
              Mobile Apps
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">iOS App</Link></li>
              <li><Link href="" className="hover:text-blue-900">Android App</Link></li>
              <li><Link href="" className="hover:text-blue-900">Mobile Web</Link></li>
              <li><Link href="" className="hover:text-blue-900">App Features</Link></li> 
              <li><Link href="" className="hover:text-blue-900">Push Notifications</Link></li> 
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SitemapPage;