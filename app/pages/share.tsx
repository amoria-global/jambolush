"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import the router

// Share Modal Component
export default function ShareModalPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize the router

  // Sample listing data
  const listing = {
    id: '123',
    title: 'Stunning 3-Bedroom House in Westlands',
    location: 'Westlands, Nairobi',
    rating: 4.8,
    reviewCount: 42,
    summary: 'Modern family home with garden and parking',
    image: '/house.jpg',
    url: 'https://jambolush.com/listing/123'
  };

  // FIXED: This function now navigates to the home page on close.
  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      // Navigate to the home page
      router.push('/');
    }, 300); // Duration should match animation duration
  };

  // This effect will now only handle the 'Escape' key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // ... the rest of your component code remains the same ...
  // (handleCopyLink, shareOptions, and the JSX return)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listing.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareOptions = [
    { name: 'Copy Link', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>, action: handleCopyLink, color: 'bg-gray-100 text-gray-800' },
    { name: 'Email', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, action: () => { const s = `Check out: ${listing.title}`; const b = `I found this on JamboLush and thought you'd like it: ${listing.url}`; window.open(`mailto:?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`); }, color: 'bg-gray-100 text-gray-800' },
    { name: 'WhatsApp', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>, action: () => { const t = `Check out this property on JamboLush: ${listing.title} - ${listing.url}`; window.open(`https://wa.me/?text=${encodeURIComponent(t)}`); }, color: 'bg-green-500 text-white' },
    { name: 'Messenger', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8l3.13 3.259L19.752 8l-6.559 6.963z"/></svg>, action: () => { window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(listing.url)}&app_id=YOUR_APP_ID_HERE`); }, color: 'bg-blue-600 text-white' },
    { name: 'Facebook', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, action: () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listing.url)}`); }, color: 'bg-blue-800 text-white' },
    { name: 'Twitter', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, action: () => { const t = `Check out this property: ${listing.title}`; window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(listing.url)}`); }, color: 'bg-black text-white' },
    { name: 'More', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>, action: () => { if(navigator.share){ navigator.share({ title: listing.title, text: listing.summary, url: listing.url }); } }, color: 'bg-gray-100 text-gray-800' }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`} 
        aria-hidden="true" 
      />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          ref={modalRef}
          className={`w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-2xl transition-all duration-300 ease-out ${isAnimatingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="w-8"></div> {/* Spacer */}
            <h2 id="share-modal-title" className="text-lg font-semibold text-gray-800 text-center">
              Share this place
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 cursor-pointer"
              aria-label="Close share modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6">
            {/* Listing Preview */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-base text-gray-800">
                  Rental unit in {listing.location}
                </p>
                <p className="text-base text-gray-500">
                  ★{listing.rating} ({listing.reviewCount} reviews) · 1 bedroom · 1 bed
                </p>
              </div>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="flex flex-col items-center justify-center text-center gap-2 cursor-pointer group"
                  aria-label={`Share via ${option.name}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${option.color} transition-transform duration-200 group-hover:scale-110`}>
                    {option.icon}
                  </div>
                  <span className="text-base font-medium text-gray-700">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Success Toast */}
          {copySuccess && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-lg">
              Link copied!
            </div>
          )}
        </div>
      </div>
    </>
  );
}