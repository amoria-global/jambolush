"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Share Modal Component
export default function ShareModalPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Sample listing data - in real app, this would come from props or context
  const listing = {
    id: '123',
    title: 'Stunning 3-Bedroom House in Westlands',
    location: 'Westlands, Nairobi',
    rating: 4.8,
    reviewCount: 42,
    summary: 'Modern family home with garden and parking',
    image: '/house.jpg', // House image
    url: 'https://jambolush.com/listing/123' // Replace with actual URL
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // In real app, navigate back or close modal
    window.history.back();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listing.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      action: handleCopyLink,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    },
    {
      name: 'Email',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      action: () => {
        const subject = encodeURIComponent(`Check out this property: ${listing.title}`);
        const body = encodeURIComponent(`I found this amazing property on JamboLush:\n\n${listing.title}\n${listing.location}\n\nView it here: ${listing.url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      action: () => {
        const text = encodeURIComponent(`Check out this property on JamboLush: ${listing.title} - ${listing.url}`);
        window.open(`https://wa.me/?text=${text}`);
      },
      color: 'bg-green-100 hover:bg-green-200 text-green-700'
    },
    {
      name: 'Messenger',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8l3.13 3.259L19.752 8l-6.559 6.963z"/>
        </svg>
      ),
      action: () => {
        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(listing.url)}&app_id=YOUR_APP_ID`);
      },
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-600'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listing.url)}`);
      },
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      action: () => {
        const text = encodeURIComponent(`Check out this property: ${listing.title}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(listing.url)}`);
      },
      color: 'bg-sky-100 hover:bg-sky-200 text-sky-700'
    },
    {
      name: 'More',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: listing.title,
            text: listing.summary,
            url: listing.url,
          });
        }
      },
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop blur effect - this would blur the actual page content behind */}
      {isOpen && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm" aria-hidden="true" />
      )}
      
      {/* Modal Container with light gray background */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#D3D3D3]">
          <div 
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl transform transition-all duration-300 scale-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
              <button
                onClick={handleClose}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close share modal"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 id="share-modal-title" className="text-xl font-semibold text-gray-900 flex-grow text-center mr-7">
                Share this place
              </h2>
              <div className="w-5"></div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Listing Preview */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-base text-gray-900">
                    Rental unit in {listing.location} · ★{listing.rating} · 1 bedroom · 1 bed · {listing.reviewCount} reviews
                  </p>
                </div>
              </div>

              {/* Share Options Grid - 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                      option.color.includes('bg-gray') 
                        ? 'border-gray-300 hover:bg-gray-50' 
                        : option.color.includes('bg-blue-100')
                        ? 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                        : option.color.includes('bg-green')
                        ? 'border-green-300 bg-green-50 hover:bg-green-100'
                        : option.color.includes('bg-sky')
                        ? 'border-sky-300 bg-sky-50 hover:bg-sky-100'
                        : option.color.includes('bg-purple')
                        ? 'border-purple-300 bg-purple-50 hover:bg-purple-100'
                        : 'border-gray-300 hover:bg-gray-50'
                    } transition-all duration-200`}
                    aria-label={`Share via ${option.name}`}
                  >
                    <div className={`${
                      option.color.includes('text-gray') ? 'text-gray-700' :
                      option.color.includes('text-blue') ? 'text-blue-700' :
                      option.color.includes('text-green') ? 'text-green-700' :
                      option.color.includes('text-sky') ? 'text-sky-700' :
                      option.color.includes('text-purple') ? 'text-purple-700' :
                      'text-gray-700'
                    }`}>{option.icon}</div>
                    <span className="text-lg font-medium text-gray-900">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* Copy Success Message */}
              {copySuccess && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Link copied!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}