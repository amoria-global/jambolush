'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from '../lib/LanguageContext';

const AboutUsPage = () => {
  const t = useTranslations();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = (entry.target as HTMLElement).dataset.animateId;
          if (elementId) {
            setVisibleElements(prev => new Set([...prev, elementId]));
          }
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[data-animate-id]');
    animatedElements.forEach(el => observerRef.current?.observe(el));

    // Track first scroll
    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { once: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getAnimationClass = (elementId: string, animationType = 'fade-up', delay = 0) => {
    const baseClasses = 'transition-all duration-700 ease-out';
    const isVisible = visibleElements.has(elementId);
    const delayClass = delay > 0 ? `delay-${delay}` : '';
    
    switch (animationType) {
      case 'fade-up':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`;
      case 'fade-up-large':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`;
      case 'fade-left':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`;
      case 'fade-right':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`;
      case 'scale-fade':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'slide-up':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`;
      case 'fade':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      default:
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              {t('about.hero.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-[#0C2D62] to-blue-900 bg-clip-text text-transparent mb-8 mt-8 leading-tight">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t('about.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section 
        data-animate-id="stats"
        className={`container mx-auto px-6 py-16 ${getAnimationClass('stats', 'fade-up')}`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div 
            data-animate-id="stat-1"
            className={`text-center ${getAnimationClass('stat-1', 'scale-fade')}`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600 font-medium">{t('about.stats.properties')}</div>
          </div>
          <div 
            data-animate-id="stat-2"
            className={`text-center ${getAnimationClass('stat-2', 'scale-fade')}`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">20+</div>
            <div className="text-gray-600 font-medium">{t('about.stats.countries')}</div>
          </div>
          <div 
            data-animate-id="stat-3"
            className={`text-center ${getAnimationClass('stat-3', 'scale-fade')}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10K+</div>
            <div className="text-gray-600 font-medium">{t('about.stats.clients')}</div>
          </div>
          <div 
            data-animate-id="stat-4"
            className={`text-center ${getAnimationClass('stat-4', 'scale-fade')}`}
            style={{ transitionDelay: '250ms' }}
          >
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">{t('about.stats.support')}</div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section 
        data-animate-id="what-we-do"
        className={`container mx-auto px-6 py-16 ${getAnimationClass('what-we-do', 'fade-up-large')}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('about.services.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.services.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div 
              data-animate-id="service-1"
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${getAnimationClass('service-1', 'scale-fade')}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.services.accommodation.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.services.accommodation.description')}
              </p>
            </div>

            <div 
              data-animate-id="service-2"
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${getAnimationClass('service-2', 'scale-fade')}`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.services.tours.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.services.tours.description')}
              </p>
            </div>

            <div 
              data-animate-id="service-3"
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${getAnimationClass('service-3', 'scale-fade')}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.services.experiences.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.services.experiences.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section 
        data-animate-id="mission-vision"
        className={`bg-white py-20 ${getAnimationClass('mission-vision', 'fade-up-large')}`}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div 
              data-animate-id="mission"
              className={getAnimationClass('mission', 'fade-right')}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission.description')}
              </p>
            </div>
            
            <div 
              data-animate-id="vision"
              className={getAnimationClass('vision', 'fade-left')}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.vision.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.vision.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section 
        data-animate-id="values"
        className={`container mx-auto px-6 py-20 ${getAnimationClass('values', 'slide-up')}`}
      >
        <div className="max-w-6xl mx-auto">
          <div 
            data-animate-id="values-header"
            className={`text-center mb-16 ${getAnimationClass('values-header', 'fade-up')}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('about.values.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.values.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Trust & Security */}
            <div 
              data-animate-id="value-trust"
              className={`group ${getAnimationClass('value-trust', 'fade-up')}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.values.trust.title')}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.values.trust.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Local Community */}
            <div 
              data-animate-id="value-community"
              className={`group ${getAnimationClass('value-community', 'fade-up')}`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.values.community.title')}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.values.community.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Innovation */}
            <div 
              data-animate-id="value-innovation"
              className={`group ${getAnimationClass('value-innovation', 'fade-up')}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.values.innovation.title')}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.values.innovation.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Excellence */}
            <div 
              data-animate-id="value-excellence"
              className={`group ${getAnimationClass('value-excellence', 'fade-up')}`}
              style={{ transitionDelay: '250ms' }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.values.excellence.title')}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('about.values.excellence.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section 
        data-animate-id="different"
        className={`bg-gradient-to-br from-blue-50 to-purple-50 py-20 ${getAnimationClass('different', 'fade-up-large')}`}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div 
              data-animate-id="different-header"
              className={getAnimationClass('different-header', 'fade-up')}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('about.whyChoose.title')}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
                {t('about.whyChoose.description')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div 
                data-animate-id="diff-1"
                className={`text-center ${getAnimationClass('diff-1', 'scale-fade')}`}
                style={{ transitionDelay: '100ms' }}
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.whyChoose.quality.title')}</h3>
                <p className="text-gray-600">
                  {t('about.whyChoose.quality.description')}
                </p>
              </div>

              <div 
                data-animate-id="diff-2"
                className={`text-center ${getAnimationClass('diff-2', 'scale-fade')}`}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.whyChoose.payments.title')}</h3>
                <p className="text-gray-600">
                  {t('about.whyChoose.payments.description')}
                </p>
              </div>

              <div 
                data-animate-id="diff-3"
                className={`text-center ${getAnimationClass('diff-3', 'scale-fade')}`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.whyChoose.support.title')}</h3>
                <p className="text-gray-600">
                  {t('about.whyChoose.support.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section 
        data-animate-id="careers"
        className={`container mx-auto px-4 py-20 ${getAnimationClass('careers', 'fade-up-large')}`}
      >
        <div className="max-w-4xl mx-auto">
          <div 
            data-animate-id="careers-content"
            className={getAnimationClass('careers-content', 'scale-fade')}
          >
            <div className="text-center">
              <p className="uppercase tracking-wide text-gray-500 text-xl mb-2">{t('about.careers.badge')}</p>
              <h2 className="text-3xl font-bold mb-4">{t('about.careers.title')}</h2>
              <p className="text-black text-xl mb-6 max-w-3xl mx-auto">
                {t('about.careers.description')}
              </p>
              <Link 
                href="/all/contact-us" 
                className="bg-[#F20C8F] text-white px-6 py-3 rounded-xl text-lg font-bold hover:bg-pink-700 items-center gap-2 inline-flex transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {t('about.careers.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;