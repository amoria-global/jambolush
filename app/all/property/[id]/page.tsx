"use client";
import AddReviewForm from '@/app/components/forms/add-review-home';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';

interface HousePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HousePage({ params }: HousePageProps) {
  const resolvedParams = use(params);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [dateError, setDateError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  const reviewsMocked = [
    { id: 1, name: 'Sarah Johnson', date: 'January 2025', rating: 5, comment: 'Amazing stay! The house was exactly as described and the location was perfect. The host was very responsive and helpful throughout our stay.' },
    { id: 2, name: 'Mike Chen', date: 'December 2024', rating: 4, comment: 'Great property with beautiful views. Minor issues with WiFi but overall excellent. Would definitely recommend to friends and family.' },
    { id: 3, name: 'Emily Davis', date: 'December 2024', rating: 5, comment: 'Absolutely loved our stay! Clean, spacious, and perfect for our family vacation. The amenities were top-notch.' },
    { id: 4, name: 'Robert Wilson', date: 'November 2024', rating: 5, comment: 'Stunning property! Everything was perfect from check-in to check-out. The views are breathtaking.' },
    { id: 5, name: 'Lisa Anderson', date: 'November 2024', rating: 4, comment: 'Very nice place, well-maintained and comfortable. Location is great for accessing local attractions.' }
  ];
  const [reviews, setReviews] = useState(reviewsMocked);
  const router = useRouter();
  
  // Sample occupied dates (these would come from your database)
  const occupiedDates = [
    { start: '2025-01-15', end: '2025-01-18' },
    { start: '2025-08-20', end: '2025-08-22' },
    { start: '2025-09-25', end: '2025-09-27' }
  ];
  
  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Sample data (replace with actual API calls)
  const house = {
    title: 'Modern Lakefront Villa',
    bedrooms: 4,
    bathrooms: 3,
    kitchen: 1,
    guests: 8,
    price: 250,
    address: '123 Lakeshore Drive, Miami Beach, FL 33139',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'Beautiful modern villa with stunning lake views and private beach access. Perfect for families and groups looking for a luxurious getaway.',
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&h=300&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ratings: {
      overall: 4.8,
      accuracy: 4.9,
      cleanliness: 4.7,
      checkin: 4.8,
      communication: 5.0,
      location: 4.6,
      value: 4.5
    },
    totalReviews: 156,
    ratingCounts: { 5: 120, 4: 28, 3: 6, 2: 2, 1: 0 }
  };

 

  // Helper function to check if a single date is occupied
  const isDateInOccupiedRange = (date: string) => {
    const checkDate = new Date(date);
    return occupiedDates.some(period => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);
      return checkDate >= periodStart && checkDate <= periodEnd;
    });
  };

  // Helper function to check if a date range overlaps with occupied dates
  const isRangeOccupied = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return occupiedDates.some(period => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);
      
      return (start >= periodStart && start <= periodEnd) ||
             (end >= periodStart && end <= periodEnd) ||
             (start <= periodStart && end >= periodEnd);
    });
  };

  // Handle check-in date change with validation
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    
    if (isDateInOccupiedRange(newDate)) {
      setDateError('Check-in date is not available. Please select another date.');
      setCheckInDate('');
      return;
    }
    
    setCheckInDate(newDate);
    setDateError('');
    
    // If check-out is set and creates an occupied range, clear it
    if (checkOutDate && isRangeOccupied(newDate, checkOutDate)) {
      setCheckOutDate('');
      setDateError('This date range includes occupied dates. Please select new dates.');
    }
  };

  // Handle check-out date change with validation
  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    
    if (isDateInOccupiedRange(newDate)) {
      setDateError('Check-out date is not available. Please select another date.');
      setCheckOutDate('');
      return;
    }
    
    if (checkInDate && isRangeOccupied(checkInDate, newDate)) {
      setDateError('This date range includes occupied dates. Please select different dates.');
      setCheckOutDate('');
      return;
    }
    
    setCheckOutDate(newDate);
    setDateError('');
  };

  const handleReserve = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert('Check-out date must be after check-in date');
      return;
    }
    //console.log('Reserving:', { checkInDate, checkOutDate, houseId: resolvedParams.id });
    //alert(`Reservation confirmed!\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nTotal: $${calculateTotal()}`);
    router.push(`/all/property/${resolvedParams.id}/confirm-and-pay`);
  };

  const calculateTotal = () => {
    if (checkInDate && checkOutDate) {
      const days = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days * house.price : 0;
    }
    return 0;
  };

  const handleUpdateReviewArray = (newReview: any) => {
    setReviews(prev => [...prev, newReview]);
    setShowAllReviews(true);
  };

  return (
    <div className="mt-14 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Title Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#083A85] mb-3 sm:mb-4 leading-tight">
            {house.title}
          </h1>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 lg:gap-6 text-base sm:text-base text-gray-700">
            <span className="flex items-center gap-2">
              <i className="bi bi-door-open text-[#F20C8F] text-lg sm:text-xl"></i>
              <span className="font-medium">{house.bedrooms} Bedrooms</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="bi bi-droplet text-[#F20C8F] text-lg sm:text-xl"></i>
              <span className="font-medium">{house.bathrooms} Bathrooms</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="bi bi-house-door text-[#F20C8F] text-lg sm:text-xl"></i>
              <span className="font-medium">{house.kitchen} Kitchen</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="bi bi-people text-[#F20C8F] text-lg sm:text-xl"></i>
              <span className="font-medium">Up to {house.guests} Guests</span>
            </span>
          </div>
        </div>

        {/* Photos Section */}
        <div className="mb-8 sm:mb-12">
          {/* Mobile: Single large image with carousel */}
          <div className="block sm:hidden">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img 
                src={house.photos[selectedPhoto]}
                alt={`House view ${selectedPhoto + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {house.photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === selectedPhoto ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button 
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-base font-medium"
                onClick={() => router.push(`/all/property/${resolvedParams.id}/photos`)}
              >
                <i className="bi bi-grid-3x3-gap mr-1"></i>
                All photos
              </button>
            </div>
          </div>

          {/* Tablet: 2x2 grid */}
          <div className="hidden sm:block lg:hidden">
            <div className="grid grid-cols-2 gap-2 h-[400px] rounded-xl overflow-hidden relative">
              {house.photos.slice(0, 4).map((photo, idx) => (
                <div 
                  key={idx} 
                  className="relative group cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPhoto(idx)}
                >
                  <img 
                    src={photo}
                    alt={`House view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
              ))}
              <button 
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow text-base font-medium"
                onClick={() => router.push(`/all/property/${resolvedParams.id}/photos`)}
              >
                <i className="bi bi-grid-3x3-gap"></i>
                Show all photos
              </button>
            </div>
          </div>

          {/* Desktop: Original 4x4 grid */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-2 h-[500px] rounded-xl overflow-hidden relative">
              <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setSelectedPhoto(0)}>
                <img 
                  src={house.photos[0]}
                  alt="Primary house view"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              {house.photos.slice(1).map((photo, idx) => (
                <div 
                  key={idx} 
                  className="relative group cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPhoto(idx + 1)}
                >
                  <img 
                    src={photo}
                    alt={`House view ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
              ))}
              <button 
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/all/property/${resolvedParams.id}/photos`)}
              >
                <i className="bi bi-grid-3x3-gap"></i>
                <span className="text-base font-medium">Show all photos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Booking Section - Above location */}
        <div className="block lg:hidden mb-8">
          <div className="border-2 border-[#083A85] rounded-xl p-4 sm:p-6 shadow-xl bg-white">
            <h3 className="text-lg sm:text-xl font-semibold text-[#083A85] mb-4">Reserve Your Stay</h3>
            <div className="mb-6">
              <p className="text-2xl sm:text-3xl font-bold text-[#F20C8F]">${house.price}</p>
              <p className="text-gray-600 text-base sm:text-base">per night</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-calendar-check mr-1"></i>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkInDate}
                    onChange={handleCheckInChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-base sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-calendar-x mr-1"></i>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={handleCheckOutChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-base sm:text-base"
                  />
                </div>
              </div>

              {dateError && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                  <p className="text-red-600 text-base font-medium">
                    <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                    {dateError}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-semibold text-base mb-2 text-gray-700">Unavailable Dates:</p>
                <div className="space-y-1">
                  {occupiedDates.map((period, idx) => (
                    <div key={idx} className="text-xs text-red-600 flex items-center gap-1">
                      <i className="bi bi-calendar-x-fill text-xs"></i>
                      <span>{new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {checkInDate && checkOutDate && (
                <div className="border-t pt-4">
                  <div className="flex justify-between text-base mb-2">
                    <span>Nights:</span>
                    <span className="font-semibold">{Math.max(0, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-[#F20C8F]">${calculateTotal()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleReserve}
                disabled={!checkInDate || !checkOutDate || !!dateError}
                className={`w-full py-3 rounded-lg font-semibold transition text-base sm:text-base ${
                  (!checkInDate || !checkOutDate || !!dateError)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#F20C8F] text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl'
                }`}
              >
                <i className="bi bi-calendar-heart mr-2"></i>
                Reserve Now
              </button>
            </div>
          </div>
        </div>

        {/* Address & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12">
          
          {/* Address & Map */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Location</h2>
            <div className="flex items-start gap-2 mb-4">
              <i className="bi bi-geo-alt-fill text-[#F20C8F] text-lg sm:text-xl mt-0.5 flex-shrink-0"></i>
              <p className="text-gray-700 font-medium text-base sm:text-base leading-relaxed">{house.address}</p>
            </div>
            <div className="w-full h-[250px] sm:h-[300px] lg:h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=-80.20778656005861%2C25.74851931365115%2C-80.17581343994142%2C25.774881107545406&layer=mapnik&marker=${house.coordinates.lat}%2C${house.coordinates.lng}`}
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            {/* Description moved here for mobile */}
            <div className="mt-6 lg:hidden">
              <h3 className="text-lg font-semibold text-[#083A85] mb-3">About This Place</h3>
              <p className="text-gray-700 text-base sm:text-base leading-relaxed">{house.description}</p>
            </div>
          </div>

          {/* Desktop Booking Window */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="border-2 border-[#083A85] rounded-xl p-6 shadow-xl sticky top-8">
              <h3 className="text-xl font-semibold text-[#083A85] mb-4">Reserve Your Stay</h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-[#F20C8F]">${house.price}</p>
                <p className="text-gray-600">per night</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-calendar-check mr-1"></i>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkInDate}
                    onChange={handleCheckInChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-calendar-x mr-1"></i>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={handleCheckOutChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition"
                  />
                </div>

                {dateError && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-600 text-base font-medium">
                      <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                      {dateError}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-base mb-2 text-gray-700">Unavailable Dates:</p>
                  <div className="space-y-1">
                    {occupiedDates.map((period, idx) => (
                      <div key={idx} className="text-xs text-red-600 flex items-center gap-1">
                        <i className="bi bi-calendar-x-fill text-xs"></i>
                        <span>{new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {checkInDate && checkOutDate && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-base mb-2">
                      <span>Nights:</span>
                      <span className="font-semibold">{Math.max(0, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-[#F20C8F]">${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReserve}
                  disabled={!checkInDate || !checkOutDate || !!dateError}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    (!checkInDate || !checkOutDate || !!dateError)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#F20C8F] text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <i className="bi bi-calendar-heart mr-2"></i>
                  Reserve Now
                </button>

                <div className="pt-4 border-t">
                  <p className="text-base text-gray-600 leading-relaxed">{house.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Video Preview */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">3D Virtual Tour</h2>
          <div className="w-full h-[250px] sm:h-[350px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/0VEizu_6XGw"
              title="Property Virtual Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4 sm:mb-6">Guest Ratings & Reviews</h2>
          
          {/* Overall Rating */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="text-center sm:text-left">
                <span className="text-4xl sm:text-5xl font-bold text-[#083A85]">{house.ratings.overall}</span>
                <div className="flex gap-1 mt-2 justify-center sm:justify-start">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`bi bi-star-fill text-[#F20C8F] text-base sm:text-lg`}></i>
                  ))}
                </div>
                <p className="text-gray-600 font-medium mt-1 text-base sm:text-base">{house.totalReviews} reviews</p>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className="w-4 text-base font-medium">{rating}</span>
                    <i className="bi bi-star-fill text-[#F20C8F] text-base"></i>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                      <div 
                        className="bg-[#F20C8F] h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(house.ratingCounts[rating as keyof typeof house.ratingCounts] / house.totalReviews) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-base text-gray-600 w-8 sm:w-12 text-right">{house.ratingCounts[rating as keyof typeof house.ratingCounts]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {Object.entries({
              accuracy: { icon: 'bi-check-circle-fill', label: 'Accuracy' },
              cleanliness: { icon: 'bi-stars', label: 'Cleanliness' },
              checkin: { icon: 'bi-key-fill', label: 'Check-in' },
              communication: { icon: 'bi-chat-dots-fill', label: 'Communication' },
              location: { icon: 'bi-geo-alt-fill', label: 'Location' },
              value: { icon: 'bi-tag-fill', label: 'Value' }
            }).map(([key, { icon, label }]) => (
              <div key={key} className="bg-white border-2 border-gray-100 rounded-xl p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                <i className={`bi ${icon} text-xl sm:text-2xl text-[#083A85] mb-2`}></i>
                <p className="text-xs sm:text-base font-semibold text-gray-700">{label}</p>
                <p className="text-lg sm:text-xl font-bold text-[#F20C8F] mt-1">
                  {house.ratings[key as keyof typeof house.ratings]}
                </p>
              </div>
            ))}
          </div>

          {/* Reviews Summary */}
          <div className="border-t pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[#083A85]">Guest Reviews</h3>
              <button className="w-full sm:w-auto px-4 sm:px-5 py-2 border-2 border-[#083A85] text-[#083A85] rounded-lg font-semibold hover:bg-[#083A85] hover:text-white transition-all text-base sm:text-base"
                      onClick={() => setShowReviewModal(true)}>
                <i className="bi bi-plus-circle mr-2"></i>
                Add Review
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3">
                    <div>
                      <p className="font-semibold text-[#083A85] text-base sm:text-base">{review.name}</p>
                      <p className="text-xs sm:text-base text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi bi-star-fill text-base ${i < review.rating ? 'text-[#F20C8F]' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base sm:text-base">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <button 
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#083A85] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl text-base sm:text-base"
              >
                <i className={`bi bi-${showAllReviews ? 'chevron-up' : 'chevron-down'} mr-2`}></i>
                {showAllReviews ? 'Show Less Reviews' : `See All ${house.totalReviews} Reviews`}
              </button>
            </div>
          </div>
        </div>

        {/* Add Review Modal */}
        {showReviewModal && ( <AddReviewForm onClose={() => setShowReviewModal(false)} onAddReview={handleUpdateReviewArray} /> )}

      </div>
    </div>
  );
}