'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- INTERFACES ---
interface Review {
  name: string;
  date: string;
  comment: string;
  rating: number;
  profileImage: string;
}
interface TourData {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  maxGuests: number;
  description: string;
  whatsIncluded: string[];
  whatsExcluded: string[];
  additionalInfo: {
    duration: string;
  };
  reviews: Review[];
  images: string[];
  occupiedDates: { start: string; end: string; }[];
  ratingDetails: {
      guide: number;
      safety: number;
      transport: number;
      value: number;
  };
  coordinates: { lat: number; lng: number; };
}

// --- MOCK DATA ---
const mockTour: TourData = {
  id: '1',
  title: 'Karisimbi Volcano Climbing Tour',
  location: 'Volcanoes National Park, Rwanda',
  rating: 4.8,
  reviewsCount: 181,
  pricePerPerson: 350,
  maxGuests: 12,
  description: `Embark on a 2-day adventure to conquer Mount Karisimbi (4,507m), Rwanda's highest volcano. Trek through diverse landscapes, camp under the stars, and summit at sunrise for sweeping views of the Virunga Mountains—an unforgettable challenge for adventurous explorers.`,
  whatsIncluded: [
    'Karisimbi hiking permit and park fees',
    'Professional guide and park ranger',
    'Overnight camping at 3,700m',
    'Packed meals during the hike',
    'Drinking water during the trek',
    'Hotel pickup and drop-off',
  ],
  whatsExcluded: [
    'Sleeping bag and personal gear',
    'Porter services (optional, ~$20/day)',
    'Tips and gratuities',
  ],
  additionalInfo: {
    duration: '2 days'
  },
  reviews: [
    { name: 'Moise Caicedo', date: 'August 2025', comment: 'Absolutely breathtaking! The climb was challenging but the sunrise view from the summit was worth every step. Our guide, John, was incredible.', rating: 5, profileImage: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Enzo fernandez', date: 'August 2025', comment: 'A truly unforgettable experience. Be prepared for cold weather at the top. The porters are a must-hire!', rating: 5, profileImage: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Willian Estavao', date: 'July 2025', comment: 'Very well-organized tour. The food provided was basic but sufficient. The scenery is out of this world.', rating: 4, profileImage: 'https://randomuser.me/api/portraits/men/50.jpg' },
  ],
  images: [
    'https://www.volcanoesnationalparkrwanda.com/wp-content/uploads/2021/04/Volcanoes-National-Park-Rwanda-3.gif',
    'https://i.pinimg.com/1200x/e0/3c/16/e03c16311a2bc3a6f51019847ac75de0.jpg',
    'https://i.pinimg.com/1200x/ed/70/b0/ed70b06421797618b79ee82e9235f7ea.jpg',
    'https://i.pinimg.com/1200x/24/7d/68/247d68eb47fd90236a2c9091b7a15a5d.jpg',
    'https://i.pinimg.com/1200x/92/19/af/9219afb9c7ca7d154110bc399e7ac99c.jpg',
    'https://i.pinimg.com/1200x/ca/a2/51/caa2511907cce2205e2a24f6bf979e4a.jpg',
  ],
  occupiedDates: [
    { start: '2025-09-15', end: '2025-09-16' },
    { start: '2025-10-20', end: '2025-10-21' },
  ],
  ratingDetails: {
      guide: 4.9,
      safety: 4.8,
      transport: 4.7,
      value: 4.6,
  },
  coordinates: { lat: -1.5015, lng: 29.4925 },
};

// --- HELPER FUNCTIONS ---
const getReviewStats = (reviews: Review[]) => {
    const total = reviews.length;
    if (total === 0) return { average: '0.0', total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }};
    
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = (totalRating / total).toFixed(1);
    
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
        counts[review.rating as keyof typeof counts]++;
    });

    return { average, total, counts };
};

// --- Add Review Form Component ---
const AddReviewForm = ({ onClose, onAddReview }: { onClose: () => void; onAddReview: (review: Review) => void; }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReview: Review = {
            name,
            rating,
            comment,
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            profileImage: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100)}`
        };
        onAddReview(newReview);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-[#083A85]">Write a Review</h3>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"/>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[5, 4, 3, 2, 1].map(star => (
                                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                                    <i className={`bi bi-star-fill text-2xl transition-colors ${rating >= star ? 'text-[#F20C8F]' : 'text-gray-300'}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"/>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="px-6 py-3 bg-[#F20C8F] text-white rounded-lg font-semibold hover:bg-opacity-90">Submit Review</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- [NEW] Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingDetails }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookingDetails: any;
}) => {
    if (!isOpen || !bookingDetails) return null;

    const { title, checkInDate, checkOutDate, guests, totalPrice, numberOfDays } = bookingDetails;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-[#083A85]">Confirm Your Reservation</h3>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                <div className="p-6">
                    <p className="font-semibold text-gray-800 mb-4">You are about to book the following experience:</p>
                    <div className="space-y-3 text-gray-700">
                        <p><strong className="font-medium text-gray-900">Tour:</strong> {title}</p>
                        <p><strong className="font-medium text-gray-900">Dates:</strong> {checkInDate} to {checkOutDate} ({numberOfDays} {numberOfDays > 1 ? 'days' : 'day'})</p>
                        <p><strong className="font-medium text-gray-900">Guests:</strong> {guests}</p>
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total Price:</span>
                                <span className="text-[#F20C8F]">${totalPrice}</span>
                            </div>
                            <p className="text-xs text-gray-500 text-right mt-1">You won't be charged yet.</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
                        <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                        <button onClick={onConfirm} className="px-6 py-2 bg-[#F20C8F] text-white rounded-lg font-semibold hover:bg-opacity-90">Confirm Booking</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const SingleTourPage = () => {
  const router = useRouter();
  // --- [MODIFIED] State Management ---
  const [tourData, setTourData] = useState(mockTour); // Use state for tour data to allow updates
  const [guests, setGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [bookingError, setBookingError] = useState(''); // New state for reservation validation errors
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // New state for confirmation modal
  const [reviews, setReviews] = useState(tourData.reviews);

  const reviewStats = getReviewStats(reviews);
  const today = new Date().toISOString().split('T')[0];

  const handleAddReview = (newReview: Review) => {
      setReviews(prev => [newReview, ...prev]);
  };

  // --- [MODIFIED] Function to use tourData from state ---
  const isRangeOccupied = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Use tourData from state, not the constant mockTour
    return tourData.occupiedDates.some(period => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);
      return (start >= periodStart && start <= periodEnd) || (end >= periodStart && end <= periodEnd) || (start <= periodStart && end >= periodEnd);
    });
  };

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setCheckInDate(newDate);
    setDateError('');
    setBookingError('');
    if (checkOutDate && isRangeOccupied(newDate, checkOutDate)) {
      setCheckOutDate('');
      setDateError('This date range includes unavailable dates. Please select new dates.');
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (checkInDate && isRangeOccupied(checkInDate, newDate)) {
      setDateError('This date range includes unavailable dates. Please select different dates.');
      setCheckOutDate('');
      return;
    }
    setCheckOutDate(newDate);
    setDateError('');
    setBookingError('');
  };

  const calculateTotal = () => {
    if (checkInDate && checkOutDate) {
      const days = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days * tourData.pricePerPerson * guests : 0;
    }
    return 0;
  };
  
  const totalPrice = calculateTotal();
  const numberOfDays = (checkInDate && checkOutDate) ? Math.max(0, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;

  // --- [NEW] Reservation Handling Logic ---
  const handleReserveClick = () => {
    setBookingError('');
    // 1. Validation
    if (!checkInDate || !checkOutDate) {
        setBookingError('Please select a start and end date.');
        return;
    }
    if (guests <= 0) {
        setBookingError('Please specify at least 1 guest.');
        return;
    }
    if (dateError) {
        setBookingError(dateError);
        return;
    }
    // 2. If validation passes, show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = () => {
    // 3. Add the new occupied dates to the tour data state
    setTourData(prevData => ({
        ...prevData,
        occupiedDates: [...prevData.occupiedDates, { start: checkInDate, end: checkOutDate }]
    }));

    // 4. Close modal and show success message
    setShowConfirmationModal(false);
    alert(`Booking Confirmed!\n\nTour: ${tourData.title}\nDates: ${checkInDate} to ${checkOutDate}\nGuests: ${guests}\n\nThank you for your reservation.`);

    // 5. Reset the form
    setCheckInDate('');
    setCheckOutDate('');
    setGuests(1);
    setDateError('');
    setBookingError('');
  };


  return (
    <div className="mt-14 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Title Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#083A85] mb-3 sm:mb-4 leading-tight">
            {tourData.title}
          </h1>
          <div className="flex items-center gap-4 text-sm sm:text-base text-gray-700">
            <span className="flex items-center gap-1.5 font-medium">
                <i className="bi bi-star-fill text-[#F20C8F]"></i> {tourData.rating} ({reviewStats.total} reviews)
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
                <i className="bi bi-geo-alt-fill text-[#F20C8F]"></i> {tourData.location}
            </span>
          </div>
        </div>

        {/* Photos Section */}
        <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-4 gap-2 h-[250px] sm:h-[500px] rounded-xl overflow-hidden relative">
              <div className="col-span-4 sm:col-span-2 sm:row-span-2 relative group cursor-pointer" onClick={() => setShowPhotoGalleryModal(true)}>
                <img src={tourData.images[0]} alt="Primary tour view" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              {tourData.images.slice(1, 5).map((photo, idx) => (
                <div key={idx} className="hidden sm:block relative group cursor-pointer overflow-hidden" onClick={() => setShowPhotoGalleryModal(true)}>
                  <img src={photo} alt={`Tour view ${idx + 2}`} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
              ))}
              <button 
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setShowPhotoGalleryModal(true)}
              >
                <i className="bi bi-grid-3x3-gap"></i>
                <span className="text-sm font-medium">Show all photos</span>
              </button>
            </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <div className="pb-6 border-b flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85]">Experience hosted by a Certified Guide</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-gray-700">
                  <span>{tourData.additionalInfo.duration}</span>
                  <span className="text-gray-300">•</span>
                  <span>Up to {tourData.maxGuests} guests</span>
                </div>
              </div>
              <img src="https://i.pinimg.com/1200x/5f/c5/3b/5fc53b52fd0e4eff1a36322f474529cd.jpg" alt="Host" className="w-14 h-14 rounded-full object-cover shadow-md flex-shrink-0"/>
            </div>

            {/* Mobile Booking Card */}
            <div className="block lg:hidden mt-8">
              <div className="border-2 border-[#083A85] rounded-xl p-4 sm:p-6 shadow-xl bg-white">
                <div className="flex justify-between items-baseline mb-4">
                    <div>
                        <span className="text-3xl font-bold text-[#F20C8F]">${tourData.pricePerPerson}</span>
                        <span className="text-gray-600"> / day</span>
                    </div>
                    <div className="font-semibold text-gray-700">
                        <i className="bi bi-star-fill text-[#F20C8F]"></i> {tourData.rating} ({reviewStats.total})
                    </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 border p-2 rounded-lg">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">START DATE</label>
                      <input type="date" min={today} value={checkInDate} onChange={handleCheckInChange}
                        className="w-full border-0 focus:ring-0 p-1 text-sm"/>
                    </div>
                    <div className="border-l pl-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">END DATE</label>
                      <input type="date" min={checkInDate || today} value={checkOutDate} onChange={handleCheckOutChange}
                        className="w-full border-0 focus:ring-0 p-1 text-sm"/>
                    </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">GUESTS</label>
                      <input type="number" min="1" max={tourData.maxGuests} value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"/>
                  </div>
                  {/* [MODIFIED] Display both date and booking errors */}
                  {dateError && <p className="text-red-600 text-sm font-medium">{dateError}</p>}
                  {bookingError && <p className="text-red-600 text-sm font-medium">{bookingError}</p>}

                  {/* [MODIFIED] Added onClick handler */}
                  <button
                    onClick={() => router.push(`/all/tour/${tourData.id}/confirm-and-pay`)}
                    className="w-full py-3 rounded-lg font-semibold bg-[#F20C8F] text-white hover:bg-opacity-90 shadow-lg"
                  >
                    Reserve
                  </button>
                  <p className="text-xs text-gray-500 text-center">You won't be charged yet</p>
                  
                  {numberOfDays > 0 &&
                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span>${tourData.pricePerPerson} x {numberOfDays} days x {guests} guests</span> <span>${totalPrice}</span></div>
                        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total</span> <span>${totalPrice}</span></div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div className="py-6 border-b space-y-4">
              <div className="flex items-start gap-4">
                <i className="bi bi-calendar2-check-fill text-2xl text-[#083A85]"></i>
                <div>
                  <h3 className="font-semibold text-gray-800">Free cancellation</h3>
                  <p className="text-gray-600 text-sm">Cancel up to 24 hours in advance for a full refund.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="bi bi-credit-card-2-front-fill text-2xl text-[#083A85]"></i>
                <div>
                  <h3 className="font-semibold text-gray-800">Reserve now & pay later</h3>
                  <p className="text-gray-600 text-sm">Keep your travel plans flexible — book your spot and pay nothing today.</p>
                </div>
              </div>
            </div>

            <div className="py-6 border-b">
              <p className="text-gray-700 leading-relaxed">{tourData.description}</p>
            </div>
            
            <div className="py-6 border-b">
                <h3 className="text-lg sm:text-xl font-semibold text-[#083A85] mb-4">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {tourData.whatsIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <i className="bi bi-check-lg text-green-500 text-xl"></i>
                            <span className="text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#083A85] mt-6 mb-4">What's Not Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {tourData.whatsExcluded.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <i className="bi bi-x-lg text-red-500 text-xl"></i>
                            <span className="text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-6 border-b">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Meeting Point & Location</h2>
                <div className="flex items-start gap-2 mb-4">
                    <i className="bi bi-geo-alt-fill text-[#F20C8F] text-lg mt-0.5"></i>
                    <p className="text-gray-700 font-medium">{tourData.location}</p>
                </div>
                <div className="w-full h-[300px] bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        width="100%" height="100%" frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=29.47, -1.52, 29.51, -1.48&layer=mapnik&marker=${tourData.coordinates.lat},${tourData.coordinates.lng}`}
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>

            <div id="reviews" className="py-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Guest Ratings & Reviews</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <i className="bi bi-star-fill text-[#F20C8F] text-2xl"></i>
                  <span className="font-bold text-2xl">{reviewStats.average}</span>
                  <span className="text-gray-600 font-medium">({reviewStats.total} reviews)</span>
                </div>
                <div className="flex-1 w-full">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-3">{rating}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-[#F20C8F] h-2 rounded-full" style={{ width: `${reviewStats.total > 0 ? (reviewStats.counts[rating as keyof typeof reviewStats.counts] / reviewStats.total) * 100 : 0}%` }}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {Object.entries({ guide: 'Guide', safety: 'Safety', transport: 'Transport', value: 'Value' }).map(([key, label]) => (
                      <div key={key} className="bg-white border-2 border-gray-100 rounded-xl p-3 text-center hover:shadow-lg transition-shadow">
                          <p className="text-sm font-semibold text-gray-700">{label}</p>
                          <p className="text-lg font-bold text-[#083A85] mt-1">{tourData.ratingDetails[key as keyof typeof tourData.ratingDetails]}</p>
                      </div>
                  ))}
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#083A85]">Reviews from Travelers</h3>
                <button onClick={() => setShowReviewModal(true)} className="px-5 py-2 border-2 border-[#083A85] text-[#083A85] rounded-lg font-semibold hover:bg-[#083A85] hover:text-white transition-all text-sm sm:text-base">
                    <i className="bi bi-plus-circle mr-2"></i>Add Review
                </button>
              </div>

              <div className="space-y-6">
                {reviews.slice(0, showAllReviews ? reviews.length : 2).map((review, idx) => (
                  <div key={idx} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={review.profileImage} alt={review.name} className="w-11 h-11 rounded-full object-cover" />
                        <div>
                            <p className="font-semibold text-[#083A85]">{review.name}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi bi-star-fill text-sm ${i < review.rating ? 'text-[#F20C8F]' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
              {reviews.length > 2 && (
                <button 
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-6 w-full sm:w-auto px-6 py-3 border-2 border-[#083A85] text-[#083A85] rounded-lg font-semibold hover:bg-[#083A85] hover:text-white transition-all">
                  {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                </button>
              )}
            </div>
          </div>

          {/* Desktop Booking Card */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="border-2 border-[#083A85] rounded-xl p-6 shadow-xl sticky top-24">
              <div className="flex justify-between items-baseline mb-4">
                <div>
                    <span className="text-3xl font-bold text-[#F20C8F]">${tourData.pricePerPerson}</span>
                    <span className="text-gray-600"> / day</span>
                </div>
                <div className="font-semibold text-gray-700">
                    <i className="bi bi-star-fill text-[#F20C8F]"></i> {tourData.rating} ({reviewStats.total})
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-0 border-2 border-gray-300 rounded-lg has-[:focus]:ring-2 has-[:focus]:ring-[#F20C8F]">
                  <div className="p-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">START DATE</label>
                    <input type="date" min={today} value={checkInDate} onChange={handleCheckInChange}
                      className="w-full border-0 focus:ring-0 p-1 text-sm"/>
                  </div>
                  <div className="border-l p-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">END DATE</label>
                    <input type="date" min={checkInDate || today} value={checkOutDate} onChange={handleCheckOutChange}
                      className="w-full border-0 focus:ring-0 p-1 text-sm"/>
                  </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">GUESTS</label>
                    <input type="number" min="1" max={tourData.maxGuests} value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"/>
                </div>
                {/* [MODIFIED] Display both date and booking errors */}
                {dateError && <p className="text-red-600 text-sm font-medium">{dateError}</p>}
                {bookingError && <p className="text-red-600 text-sm font-medium">{bookingError}</p>}

                {/* [MODIFIED] Added onClick handler */}
                <button
                  onClick={() => router.push(`/all/tour/${tourData.id}/confirm-and-pay`)}
                  className="w-full py-3 rounded-lg font-semibold bg-[#F20C8F] text-white hover:bg-opacity-90 shadow-lg"
                >
                  Reserve
                </button>
                <p className="text-xs text-gray-500 text-center">You won't be charged yet</p>

                {numberOfDays > 0 &&
                  <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span>${tourData.pricePerPerson} x {numberOfDays} days x {guests} guests</span> <span>${totalPrice}</span></div>
                      <div className="flex justify-between"><span>Service Fee</span> <span>$0</span></div>
                      <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total</span> <span>${totalPrice}</span></div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showReviewModal && <AddReviewForm onClose={() => setShowReviewModal(false)} onAddReview={handleAddReview} />}
      
      {/* [NEW] Render Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmBooking}
        bookingDetails={{
            title: tourData.title,
            checkInDate,
            checkOutDate,
            guests,
            totalPrice,
            numberOfDays,
        }}
      />

      {showPhotoGalleryModal && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col p-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">All Photos ({tourData.images.length})</h3>
                    <button onClick={() => setShowPhotoGalleryModal(false)} className="text-2xl w-10 h-10 bg-gray-100 rounded-full">&times;</button>
                </div>
                <div className="max-h-[85vh] overflow-y-auto">
                    <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
                        {tourData.images.map((img, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden shadow-md break-inside-avoid">
                                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SingleTourPage;