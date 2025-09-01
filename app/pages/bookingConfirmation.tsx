//app/pages/bookingConfirmation.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../api/apiService';

interface BookingData {
  id: string;
  propertyName: string;
  propertyImage: string;
  propertyLocation: string;
  guestName: string;
  guestEmail: string;
  hostName: string;
  hostEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalPrice: number;
  status: string;
  paymentTiming: string;
  paymentMethod?: string;
  confirmationCode: string;
  message?: string;
  createdAt: string;
}

interface BookingConfirmationProps {
  bookingId?: string;
  confirmationCode?: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  bookingId: propBookingId, 
  confirmationCode: propConfirmationCode 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get booking ID and confirmation code from props or URL
  const bookingId = propBookingId || searchParams.get('id') || '';
  const confirmationCode = propConfirmationCode || searchParams.get('code') || '';
  
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('Booking ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.getBookingByConfirmation(bookingId);
        
        if (response.data.success) {
          setBooking(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load booking details');
        }
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        const errorMessage = err?.response?.data?.message || 
                           err?.response?.data?.errors?.join(', ') ||
                           err?.message || 
                           'Failed to load booking details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bi-check-circle-fill';
      case 'pending': return 'bi-clock-fill';
      case 'cancelled': return 'bi-x-circle-fill';
      case 'completed': return 'bi-check2-circle';
      default: return 'bi-info-circle-fill';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (!booking) return;
    
    const subject = `Booking Confirmation - ${booking.confirmationCode}`;
    const body = `Hello,

Here are my booking details:

Property: ${booking.propertyName}
Location: ${booking.propertyLocation}
Check-in: ${formatDate(booking.checkIn)} at 3:00 PM
Check-out: ${formatDate(booking.checkOut)} at 11:00 AM
Guests: ${booking.guests}
Confirmation Code: ${booking.confirmationCode}

Total: $${booking.totalPrice}

Payment: ${booking.paymentTiming === 'later' ? 'Pay at Property' : 'Paid Online'}

Best regards,
${booking.guestName}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShare = async () => {
    if (!booking) return;

    const shareData = {
      title: `Booking Confirmation - ${booking.propertyName}`,
      text: `I've booked ${booking.propertyName} from ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}. Confirmation: ${booking.confirmationCode}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Booking link copied to clipboard!');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <i className="bi bi-exclamation-triangle-fill text-red-600 text-4xl mb-4"></i>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Booking Not Found</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <i className={`bi ${getStatusIcon(booking.status)} text-green-600 text-3xl`}></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {booking.status === 'pending' ? 'Booking Submitted!' : 'Booking Confirmed!'}
          </h1>
          <p className="text-gray-600 text-lg">
            {booking.status === 'pending' 
              ? 'Your booking request has been submitted and is awaiting host confirmation'
              : 'Your reservation is confirmed and ready'
            }
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          
          {/* Header with Property Image */}
          <div className="relative h-48 sm:h-64">
            <img
              src={booking.propertyImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
              alt={booking.propertyName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl sm:text-2xl font-bold">{booking.propertyName}</h2>
              <p className="text-white/90 flex items-center">
                <i className="bi bi-geo-alt-fill mr-1"></i>
                {booking.propertyLocation}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Status and Confirmation Code */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border mb-4 sm:mb-0 ${getStatusColor(booking.status)}`}>
                <i className={`bi ${getStatusIcon(booking.status)} mr-2`}></i>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-600">Confirmation Code</p>
                <p className="font-mono text-lg font-bold text-blue-600">{booking.confirmationCode}</p>
              </div>
            </div>

            {/* Guest Information */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Guest Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Guest Name</p>
                  <p className="font-medium">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{booking.guestEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Host</p>
                  <p className="font-medium">{booking.hostName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Guests</p>
                  <p className="font-medium">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Stay Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* Check-in Details */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <i className="bi bi-calendar-check text-green-600 text-xl mr-2"></i>
                  <h3 className="font-semibold text-gray-900">Check-in</h3>
                </div>
                <p className="text-gray-800 font-medium text-lg">{formatDate(booking.checkIn)}</p>
                <p className="text-gray-600 text-sm">After 3:00 PM</p>
              </div>

              {/* Check-out Details */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <i className="bi bi-calendar-x text-blue-600 text-xl mr-2"></i>
                  <h3 className="font-semibold text-gray-900">Check-out</h3>
                </div>
                <p className="text-gray-800 font-medium text-lg">{formatDate(booking.checkOut)}</p>
                <p className="text-gray-600 text-sm">Before 11:00 AM</p>
              </div>

            </div>

            {/* Payment Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">${booking.pricePerNight}/night × {booking.nights} nights</span>
                    <span className="font-medium">${booking.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span className="font-medium">${booking.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">${booking.serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">${booking.taxes}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-xl text-green-600">${booking.totalPrice}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {booking.paymentTiming === 'later' ? 'Pay at Property' : (booking.paymentMethod || 'Online Payment')}
                  </span>
                </div>
              </div>

              {booking.paymentTiming === 'later' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <i className="bi bi-info-circle-fill text-yellow-600 mr-2 mt-0.5"></i>
                    <div>
                      <p className="text-yellow-800 font-medium mb-1">Payment Due at Property</p>
                      <p className="text-yellow-700 text-sm">
                        Please bring the total amount (${booking.totalPrice}) to pay upon arrival. 
                        Cash or card may be accepted - please confirm with your host.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message from guest */}
            {booking.message && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Message to Host</h4>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{booking.message}</p>
              </div>
            )}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <i className="bi bi-printer mr-2"></i>
            Print Confirmation
          </button>
          
          <button
            onClick={handleEmail}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <i className="bi bi-envelope mr-2"></i>
            Email Details
          </button>
          
          <button
            onClick={handleShare}
            className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <i className="bi bi-share mr-2"></i>
            Share Booking
          </button>
        </div>

        {/* Important Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="bi bi-info-circle text-blue-600 mr-2"></i>
            Important Information
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <i className="bi bi-clock text-blue-600 mr-2 mt-0.5"></i>
              <p>Check-in is between 3:00 PM and 8:00 PM. Please coordinate with your host if arriving outside these hours.</p>
            </div>
            <div className="flex items-start">
              <i className="bi bi-person-badge text-blue-600 mr-2 mt-0.5"></i>
              <p>Bring a valid government-issued ID for verification during check-in.</p>
            </div>
            <div className="flex items-start">
              <i className="bi bi-telephone text-blue-600 mr-2 mt-0.5"></i>
              <p>Contact your host at least 24 hours before arrival to confirm check-in details.</p>
            </div>
            <div className="flex items-start">
              <i className="bi bi-calendar-x text-blue-600 mr-2 mt-0.5"></i>
              <p>Check-out is by 11:00 AM on your departure date. Late check-out may incur additional fees.</p>
            </div>
            {booking.status === 'pending' && (
              <div className="flex items-start bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <i className="bi bi-hourglass text-yellow-600 mr-2 mt-0.5"></i>
                <p className="text-yellow-800 font-medium">
                  Your booking is pending host confirmation. You'll receive an update within 24 hours. 
                  The host may contact you directly during this time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Host Contact</h4>
              <p className="text-gray-700">{booking.hostName}</p>
              <p className="text-gray-600 text-sm">{booking.hostEmail}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Customer Support</h4>
              <p className="text-gray-700">24/7 Support Available</p>
              <p className="text-gray-600 text-sm">support@jambolush.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <i className="bi bi-arrow-left mr-2"></i>
            Return to Homepage
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;