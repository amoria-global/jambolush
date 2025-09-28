"use client";

import React from "react";
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useLanguage } from '../lib/LanguageContext'; // 👈 Import useLanguage hook

const SitemapPage: React.FC = () => {
  const { t } = useLanguage(); // 👈 Initialize the hook

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl px-4 md:px-12 py-13">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 mt-6 text-center">
          <i className="bi bi-sitemap mr-2"></i>
          {t('sitemap.title')}
        </h1>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">

          {/* Home / Company */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-house-door-fill text-pink-500 mr-2"></i>
              {t('sitemap.sections.home')}
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.mainPage')}</Link></li>
              <li><Link href="/all/about" className="hover:text-blue-900">{t('sitemap.links.aboutUs')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.careers')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.press')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.blog')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.investors')}</Link></li>
            </ul>
          </div>

          {/* Account / User */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-person-fill text-pink-500 mr-2"></i>
              {t('sitemap.sections.account')}
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.login')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.signUp')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.profile')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.trips')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.wishlist')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.giftCards')}</Link></li>
              <li><Link href="/" className="hover:text-blue-900">{t('sitemap.links.referFriend')}</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-geo-alt-fill text-pink-500 mr-2"></i>
              {t('sitemap.sections.destinations')}
            </h2>
            {/* Note: Specific destination links are not in the JSON files and remain static. */}
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
              {t('sitemap.sections.experiences')}
            </h2>
            {/* Note: Specific experience links are not in the JSON files and remain static. */}
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
              {t('sitemap.sections.support')}
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.helpCenter')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.faq')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.contactSupport')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.safety')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.communityGuidelines')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.partners')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.sustainability')}</Link></li>
            </ul>
          </div>

          {/* Policies / Legal */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-shield-lock-fill text-pink-500 mr-2"></i>
                 {t('sitemap.sections.policies')}
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.termsConditions')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.privacyPolicy')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.cookiesPolicy')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.refundPolicy')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.cancellationPolicy')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.compliance')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.disclaimer')}</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-building text-pink-500 mr-2"></i>
              {t('sitemap.sections.hosting')}
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.becomeHost')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.hostingTools')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.resources')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.hostSafety')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.hostingStandards')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.experiencesForWork')}</Link></li>
            </ul>
          </div>

          {/* Mobile Apps */}
          <div>
            <h2 className="text-base font-semibold text-navy-800 mb-3 flex items-center">
              <i className="bi bi-phone-fill text-pink-500 mr-2"></i>
              {t('sitemap.sections.mobileApps')}
            </h2>
            <ul className="space-y-2 text-gray-600 text-base">
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.iosApp')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.androidApp')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.mobileWeb')}</Link></li>
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.appFeatures')}</Link></li> 
              <li><Link href="" className="hover:text-blue-900">{t('sitemap.links.pushNotifications')}</Link></li> 
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;