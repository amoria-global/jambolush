'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const AboutUsPage = () => {
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
    const baseClasses = 'transition-all duration-600 ease-out';
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
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'}`;
      case 'slide-up':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`;
      case 'fade':
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      default:
        return `${baseClasses} ${delayClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans mt-12 mx-4 md:mx-12">
      {/* Header - No scroll animation */}
      <header className="container mx-auto px-4 pt-8 text-center">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#0C2D62] mb-4">About JAMBOLUSH</h1>
        </div>
        <div>
          <p className="max-w-2xl mx-auto text-black text-xl md:text-xl leading-relaxed">
            Jambolush is a dynamic platform designed to connect people with unique living and 
            working spaces. We aim to create flexible, comfortable, and inspiring environments for 
            individuals, teams, and businesses. By offering easy access to quality spaces, 
            we help our users focus on what truly matters whether it's productivity, creativity, or collaboration.
          </p>
        </div>
      </header>

      {/* Three Images Section - Start scroll animations here */}
      <section className="container mx-auto px-4 py-8">
        <div 
          data-animate-id="images-container"
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${getAnimationClass('images-container', 'fade-up-large')}`}
        >
          <div 
            data-animate-id="image-1"
            className={getAnimationClass('image-1', 'scale-fade')}
            style={{ transitionDelay: '50ms' }}
          >
            <img src="https://plus.unsplash.com/premium_photo-1661767467261-4a4bed92a507?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Team working" className="w-full h-56 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" />
          </div>
          <div 
            data-animate-id="image-2"
            className={getAnimationClass('image-2', 'scale-fade')}
            style={{ transitionDelay: '100ms' }}
          >
            <img src="https://plus.unsplash.com/premium_photo-1661953971836-a5a88abca0dd?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Home Office Corner" className="w-full h-56 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" />
          </div>
          <div 
            data-animate-id="image-3"
            className={getAnimationClass('image-3', 'scale-fade')}
            style={{ transitionDelay: '150ms' }}
          >
            <img src="https://images.unsplash.com/photo-1550399504-8953e1a6ac87?q=80&w=1329&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="vacation" className="w-full h-56 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" />
          </div>
        </div>
      </section>

      {/* Ratings Section */}
      <section 
        data-animate-id="ratings"
        className={`container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-8 text-center py-6 ${getAnimationClass('ratings', 'slide-up')}`}
      >
        <div 
          data-animate-id="rating-1"
          className={getAnimationClass('rating-1', 'fade-up')}
          style={{ transitionDelay: '50ms' }}
        >
          <p className="text-xl font-semibold text-gray-700">REVIEWED ON</p>
          <p className="text-red-500 font-bold text-xl">★★★★★</p>
          <p className="text-xl text-gray-500">Clutch · 50 Ratings</p>
        </div>
        <div 
          data-animate-id="rating-2"
          className={getAnimationClass('rating-2', 'fade-up')}
          style={{ transitionDelay: '100ms' }}
        >
          <p className="text-xl font-semibold text-gray-700">GoodFirms</p>
          <p className="text-yellow-500 font-bold text-xl">★★★★★</p>
          <p className="text-xl text-gray-500">9 Reviews</p>
        </div>
        <div 
          data-animate-id="rating-3"
          className={getAnimationClass('rating-3', 'fade-up')}
          style={{ transitionDelay: '150ms' }}
        >
          <p className="text-xl font-semibold text-gray-700">READ REVIEWS ON</p>
          <p className="text-red-500 font-bold text-xl">★★★★★</p>
          <p className="text-xl text-gray-500">G2</p>
        </div>
      </section>

      {/* Our Mission & Our Vision */}
      <section 
        data-animate-id="mission-vision-container"
        className={`container mx-auto px-4 py-12 ${getAnimationClass('mission-vision-container', 'fade-up-large')}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            data-animate-id="mission"
            className={getAnimationClass('mission', 'fade-right')}
            style={{ transitionDelay: '100ms' }}
          >
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-black text-xl">
              Our mission is to provide seamless access to versatile living and working spaces that 
              inspire productivity, creativity, and community. We aim to make finding, sharing, 
              and experiencing spaces effortless, safe, and enjoyable for everyone. Through innovation 
              and customer-centric solutions, we empower our users to focus on their goals without worrying about logistics.
            </p>
          </div>
          <div 
            data-animate-id="vision"
            className={getAnimationClass('vision', 'fade-left')}
            style={{ transitionDelay: '200ms' }}
          >
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-black text-xl">
              Our vision is to become the leading platform for flexible spaces worldwide, where people, teams, 
              and businesses can thrive in environments tailored to their needs. We envision a world where access to 
              high-quality spaces is simple, reliable, and enhances lifestyles and work efficiency, fostering connections 
              and collaboration across communities.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        data-animate-id="values-section"
        className={`container mx-auto px-4 py-12 ${getAnimationClass('values-section', 'slide-up')}`}
      >
        <div 
          data-animate-id="values-title"
          className={getAnimationClass('values-title', 'fade-up')}
          style={{ transitionDelay: '50ms' }}
        >
          <h2 className="text-xl font-bold text-black mb-6">Our values</h2>
        </div>

        {/* Value Item 1 */}
        <div 
          data-animate-id="value-1"
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 ${getAnimationClass('value-1', 'fade-up-large')}`}
          style={{ transitionDelay: '100ms' }}
        >
          <img src="https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SW5ub3ZhdGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="Innovation" className="w-full rounded-lg object-cover h-64 shadow-lg" />
          <div>
            <p className="text-[#F20C8F] text-xl font-semibold mb-1">01</p>
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-black mb-3 text-xl md:text-xl">
              At Jambolush, innovation is at the heart of everything we do. We are committed to continuously 
              improving our platform, adopting the latest technology, and creating creative solutions that 
              anticipate and meet the evolving needs of our users. We embrace new ideas, experiment with bold
               approaches, and adapt quickly to provide experiences that are both efficient and inspiring.
            </p>
            <Link href="/all/explore-more" className="text-[#F20C8F] text-xl font-semibold hover:underline">
              Explore more →
            </Link>
          </div>
        </div>

        {/* Value Item 2 */}
        <div 
          data-animate-id="value-2"
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 ${getAnimationClass('value-2', 'fade-up-large')}`}
          style={{ transitionDelay: '150ms' }}
        >
          <div>
            <p className="text-[#F20C8F] text-xl font-semibold mb-1">02</p>
            <h3 className="text-xl font-bold mb-3">Intergrity & Proffesionalism</h3>
            <p className="text-black mb-3 text-xl md:text-xl">
            Trust is the foundation of our relationship with every user, partner, and community member.
            We prioritize transparency in all our interactions, ensure secure and reliable processes, 
            and maintain integrity in every decision we make. Our goal is to create a dependable platform where 
            users feel confident booking, sharing, and engaging with spaces.
            </p>
            <Link href="all/case-study" className="text-[#F20C8F] text-xl font-semibold hover:underline">
              Case study →
            </Link>
          </div>
          <img src="https://media.istockphoto.com/id/1924766978/photo/business-ethics-concept-ethical-investment-sustianable-development-business-integrity-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=rb41AM3ez9Ad5NOGqkFQN2QU3kkiqRQFbWO21K-0C5w=" alt="Intergrity & Proffesionalism" className="w-full rounded-lg object-cover h-64 shadow-lg" />
        </div>

        {/* Value Item 3 */}
        <div 
          data-animate-id="value-3"
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 ${getAnimationClass('value-3', 'fade-up-large')}`}
          style={{ transitionDelay: '200ms' }}
        >
          <img src="https://images.unsplash.com/photo-1499540633125-484965b60031?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Community" className="w-full rounded-lg object-cover h-64 shadow-lg" />
          <div>
            <p className="text-[#F20C8F] text-xl font-semibold mb-1">03</p>
            <h3 className="text-xl font-bold mb-3">Community</h3>
            <p className="text-black mb-3 text-xl md:text-xl">
              We believe in the power of connections. Jambolush fosters collaboration and meaningful interactions 
              among individuals, teams, and organizations. By encouraging shared experiences, supporting local networks,
               and nurturing a sense of belonging, we help our users create value together and build stronger communities.
            </p>
            <Link href="/all/learn-more" className="text-[#F20C8F] text-xl font-semibold hover:underline">
              Learn more →
            </Link>
          </div>
        </div>

        {/* Value Item 4 */}
        <div 
          data-animate-id="value-4"
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${getAnimationClass('value-4', 'fade-up-large')}`}
          style={{ transitionDelay: '250ms' }}
        >
          <div>
            <p className="text-[#F20C8F] text-xl font-semibold mb-1">04</p>
            <h3 className="text-xl font-bold mb-3">Excellence</h3>
            <p className="text-black mb-3 text-xl md:text-xl">
              Excellence guides our approach to service, technology, and user experience. We strive to 
              deliver the highest standards in every aspect of our platform, from the quality of spaces
               listed to the responsiveness of our support. Our commitment to excellence ensures that every 
               interaction with Jambolush is seamless, professional, and satisfying.
            </p>
            <Link href="/all/discover" className="text-[#F20C8F] text-xl font-semibold hover:underline">
              Discover how →
            </Link>
          </div>
          <img src="https://images.unsplash.com/photo-1541186877-bb5a745edde5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RXhjZWxsZW5jZXxlbnwwfHwwfHx8MA%3D%3D" alt="Excellence" className="w-full rounded-lg object-cover h-64 shadow-lg" />
        </div>

        {/* Value Item 5 */}
        <div 
          data-animate-id="value-5"
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 mt-12 ${getAnimationClass('value-5', 'fade-up-large')}`}
          style={{ transitionDelay: '300ms' }}
        >
          <img src="https://media.istockphoto.com/id/2164609178/photo/low-angle-view-of-tree-branches-seen-through-lens-held-by-hand.webp?a=1&b=1&s=612x612&w=0&k=20&c=3xVt5gjjfllgbdfhN9EAX6Jt8sztESIC4Xrnm8ZIbvg=" alt=" Transparency" className="w-full rounded-lg object-cover h-64 shadow-lg" />
          <div>
            <p className="text-[#F20C8F] text-xl font-semibold mb-1">05</p>
            <h3 className="text-xl font-bold mb-3"> Transparency</h3>
            <p className="text-black mb-3 text-xl md:text-xl">
              At Jambolush, we ensure that users have full visibility into every aspect of their experience, 
              from property details and pricing to booking policies and safety measures. By sharing information openly and 
              maintaining accountability, we build trust with our users and partners, allowing them to make informed decisions with confidence. 
              Transparency also guides our internal operations, fostering a culture of integrity, fairness, and collaboration across the entire team.
            </p>
            <Link href="/all/learn-more" className="text-[#F20C8F] text-xl font-semibold hover:underline">
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Serve & our commitment*/}
      <section 
        data-animate-id="serve-commitment-container"
        className={`container mx-auto px-4 py-12 ${getAnimationClass('serve-commitment-container', 'slide-up')}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            data-animate-id="who-we-serve"
            className={getAnimationClass('who-we-serve', 'fade-right')}
            style={{ transitionDelay: '100ms' }}
          >
            <h2 className="text-2xl font-bold mb-3">Who We Serve</h2>
            <p className="text-black text-xl mb-6">
              We partner with startups, enterprises, and non-profit organizations across various industries, 
              helping them shape their identity and achieve sustainable growth.
            </p>
          </div>
        
          <div 
            data-animate-id="commitment"
            className={getAnimationClass('commitment', 'fade-left')}
            style={{ transitionDelay: '200ms' }}
          >
            <h2 className="text-2xl font-bold mb-3">Our Commitment</h2>
            <p className="text-black text-xl">
              We are committed to delivering high-quality, user-focused solutions. Our dedication to 
              innovation, transparency, and collaboration ensures that we exceed our clients' expectations.
            </p>
          </div>
        </div>
      </section>

      {/* Become One of Us Section */}
      <section 
        data-animate-id="careers"
        className={`container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${getAnimationClass('careers', 'fade-up-large')}`}
        style={{ transitionDelay: '50ms' }}
      >
        <div>
          <p className="uppercase tracking-wide text-gray-500 text-xl mb-2">Careers / Open Roles</p>
          <h2 className="text-3xl font-bold mb-4">Be Part of Jambolush</h2>
          <p className="text-black text-xl mb-6">
           At Jambolush, we believe in creating more than just a platform we're building a community that connects people with places. 
           Want to be part of our journey? Join the Jambolush team and enjoy the freedom to work remotely from anywhere in the world. 
           We're excited to hear from you!
          </p>
         <Link href="/all/contact-us"className="bg-pink-500 text-white px-3 py-2 rounded text-xl font-medium hover:bg-pink-700 flex items-center gap-1 inline-flex">
            <i className="bi bi-telephone-fill text-xl"></i>
            Contact Us
       </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;