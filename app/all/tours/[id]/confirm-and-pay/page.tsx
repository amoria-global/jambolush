"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/app/api/apiService';
import { decodeId } from '@/app/utils/encoder';
import { calculatePriceBreakdown } from '@/app/utils/pricing';

interface TourBookingData {
  id: string;
  tourId: number;
  tourTitle: string;
  hostId: number;
  scheduleId: string;
  scheduleDate: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  numberOfParticipants: number;
  participants: Array<{
    name: string;
    age: number;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  }>;
  totalAmount: number;
  pricePerPerson: number;
  basePricePerPerson: number;
  status: string;
  specialRequests?: string;
  tourDetails?: {
    duration: number;
    difficulty: string;
    locationCity: string;
    locationCountry: string;
    meetingPoint: string;
    images?: any;
  };
  priceBreakdown?: {
    basePrice: number;
    displayPrice: number;
    subtotal: number;
    serviceFee: number;
    taxes: number;
    total: number;
  };
}

const USD_TO_RWF_RATE = 1499.9;

const TourPaymentPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<TourBookingData | null>(null);
  const [fetchingBooking, setFetchingBooking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.success) {
          setCurrentUser(response.data.data);
        } else if (response.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // Load booking data
  useEffect(() => {
    const decodedId = decodeId(searchParams.get('bookingId') || '');
    const bookingId = decodedId;

    if (bookingId) {
      fetchTourBookingData(bookingId);
    } else {
      setErrors({ general: 'Booking ID is required' });
      setFetchingBooking(false);
    }
  }, [searchParams]);

  const fetchTourBookingData = async (bookingId: string) => {
    try {
      setFetchingBooking(true);
      
      const response = await api.get(`/tours/guest/bookings/${bookingId}`);
      
      if (response.data.success && response.data.data) {
        const booking = response.data.data;
        
        let tourDetails: any = null;
        let hostId = booking.hostId || 1;
        
        try {
          const tourResponse = await api.get(`/tours/${booking.tourId}`);
          if (tourResponse.data.success && tourResponse.data.data) {
            const tour = tourResponse.data.data;
            tourDetails = {
              duration: tour.duration,
              difficulty: tour.difficulty,
              locationCity: tour.locationCity,
              locationCountry: tour.locationCountry,
              meetingPoint: tour.meetingPoint,
              images: tour.images
            };
            hostId = tour.hostId || hostId;
          }
        } catch (error) {
          console.warn('Could not fetch tour details:', error);
        }

        let scheduleDetails = {
          scheduleDate: booking.scheduleDate || 'TBD',
          scheduleStartTime: booking.scheduleStartTime || '09:00',
          scheduleEndTime: booking.scheduleEndTime || '17:00'
        };

        if (booking.scheduleId && tourDetails) {
          try {
            const scheduleResponse = await api.get(`/tours/${booking.tourId}/schedules/${booking.scheduleId}`);
            if (scheduleResponse.data.success && scheduleResponse.data.data) {
              const schedule = scheduleResponse.data.data;
              scheduleDetails = {
                scheduleDate: schedule.startDate,
                scheduleStartTime: schedule.startTime,
                scheduleEndTime: schedule.endTime
              };
            }
          } catch (error) {
            console.warn('Could not fetch schedule details:', error);
          }
        }

        const displayPricePerPerson = booking.totalAmount / booking.numberOfParticipants;
        const basePricePerPerson = displayPricePerPerson;
        
        const priceBreakdown = calculatePriceBreakdown(basePricePerPerson, booking.numberOfParticipants, false);

        setBookingData({
          id: booking.id,
          tourId: booking.tourId,
          tourTitle: booking.tourTitle || 'Tour Experience',
          hostId,
          scheduleId: booking.scheduleId,
          ...scheduleDetails,
          numberOfParticipants: booking.numberOfParticipants,
          participants: booking.participants || [],
          totalAmount: booking.totalAmount,
          pricePerPerson: displayPricePerPerson,
          basePricePerPerson: basePricePerPerson,
          status: booking.status,
          specialRequests: booking.specialRequests,
          tourDetails,
          priceBreakdown: {
            basePrice: basePricePerPerson,
            displayPrice: displayPricePerPerson,
            subtotal: displayPricePerPerson * booking.numberOfParticipants,
            serviceFee: priceBreakdown.serviceFee,
            taxes: priceBreakdown.taxes,
            total: priceBreakdown.total
          }
        });
      } else {
        setErrors({ general: 'Tour booking not found or invalid' });
      }
    } catch (error: any) {
      console.error('Failed to fetch tour booking:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to load booking details';
      setErrors({ general: errorMessage });
    } finally {
      setFetchingBooking(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !bookingData || !currentUser) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const finalAmount = bookingData.priceBreakdown?.total || bookingData.totalAmount;
      
      // Convert USD to RWF for processing
      const finalAmountRWF = Math.round(finalAmount * USD_TO_RWF_RATE);

      // ==================== ESCROW INTEGRATION ====================
      // Create deposit through Pesapal Escrow API
      const depositPayload = {
        amount: finalAmountRWF,
        currency: 'RWF',
        reference: `TOUR-${bookingData.id}-${Date.now()}`,
        description: `Payment for ${bookingData.tourTitle}`,
        hostId: bookingData.hostId,
        agentId: undefined, // Set if you have agent system
        splitRules: {
          host: 78.95,      // Host gets 78.95%
          agent: 4.38,      // Agent gets 4.38%
          platform: 16.67   // Platform gets 16.67%
        },
        billingInfo: {
          email: currentUser.email,
          phone: currentUser.phone || '+250788123456',
          firstName: currentUser.firstName || 'Guest',
          lastName: currentUser.lastName || 'User',
          countryCode: 'RW'
        },
        // Tour-specific metadata
        metadata: {
          bookingType: 'tour',
          tourId: bookingData.tourId,
          scheduleId: bookingData.scheduleId,
          numberOfParticipants: bookingData.numberOfParticipants,
          scheduleDate: bookingData.scheduleDate,
          tourTitle: bookingData.tourTitle
        }
      };

      console.log('[PAYMENT] Creating escrow deposit:', depositPayload);

      // Call Pesapal Escrow API
      const response = await api.post('/payments/deposits', depositPayload);

      if (response.data.success) {
        const { transaction, checkoutUrl } = response.data.data;
        
        console.log('[PAYMENT] Escrow deposit created:', transaction);
        console.log('[PAYMENT] Redirecting to Pesapal:', checkoutUrl);

        // Store transaction ID in session/local storage for callback
        sessionStorage.setItem('escrow_transaction_id', transaction.id);
        sessionStorage.setItem('tour_booking_id', bookingData.id);

        // Redirect to Pesapal payment page
        window.location.href = checkoutUrl;
      } else {
        setErrors({ 
          general: response.data.message || 'Failed to create payment. Please try again.' 
        });
      }
    } catch (error: any) {
      console.error('[PAYMENT] Escrow deposit error:', error);
      
      const errorMessage = error?.response?.data?.error?.message || 
                          error?.response?.data?.message ||
                          error?.message || 
                          'Payment failed. Please try again.';
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Loading state
  if (fetchingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (errors.general && !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <i className="bi bi-exclamation-triangle-fill text-4xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">{errors.general}</p>
          <button 
            onClick={() => router.push('/tours')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>Confirm and Pay - Secure Payment</title>
      </head>
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
        
        <style jsx>{`
          @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css');
          
          input:focus {
            outline: none;
            border-color: #F20C8F;
            box-shadow: 0 0 0 3px rgba(242, 12, 143, 0.1);
          }
          
          .error-input {
            border-color: #ef4444 !important;
          }
          
          .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}</style>
        
        <div className="max-w-7xl mx-auto mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Side - Payment Summary */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              
              {/* Payment Summary and Submit */}
              {bookingData && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4" style={{ color: '#083A85' }}>
                    Payment Summary
                  </h2>
                  
                  {errors.general && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm font-medium">
                        <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                        {errors.general}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Subtotal ({bookingData.numberOfParticipants} participants)</span>
                      <span className="font-medium">${bookingData.priceBreakdown?.subtotal || bookingData.totalAmount}</span>
                    </div>
                    
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Taxes (4%)</span>
                      <span className="font-medium">${bookingData.priceBreakdown?.taxes || 0}</span>
                    </div>
                    
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold" style={{ color: '#083A85' }}>Total</span>
                      <span className="font-bold text-lg" style={{ color: '#083A85' }}>
                        ${bookingData.priceBreakdown?.total || bookingData.totalAmount}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'cursor-pointer hover:opacity-90'
                    }`}
                    style={loading ? {} : { backgroundColor: '#F20C8F' }}>
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill mr-2"></i>
                        Pay ${bookingData.priceBreakdown?.total || bookingData.totalAmount} Securely
                      </>
                    )}
                  </button>
                  
                  <p className="text-base text-gray-500 mt-4 text-center">
                    <i className="bi bi-lock-fill mr-1"></i>
                    Secured payment gateway
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Tour Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4 p-4">
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#083A85' }}>
                  {bookingData?.tourTitle || 'Tour Experience'}
                </h3>
                
                {bookingData && (
                  <>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tour Date:</span>
                        <span className="font-medium">
                          {formatDate(bookingData.scheduleDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {bookingData.scheduleStartTime} - {bookingData.scheduleEndTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participants:</span>
                        <span className="font-medium">{bookingData.numberOfParticipants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per person:</span>
                        <span className="font-medium">${bookingData.pricePerPerson}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg" style={{ color: '#083A85' }}>
                          ${bookingData.priceBreakdown?.total || 0}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <i className="bi bi-shield-check text-blue-600 mr-2 mt-1"></i>
                    <div className="text-xs text-blue-800">
                      <div className="font-semibold mb-1">Secure Payment</div>
                      <div>Your payment information is encrypted and secure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourPaymentPage;