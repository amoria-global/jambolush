"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../../api/apiService';
import { decodeId } from '@/app/utils/encoder';
import { calculatePriceBreakdown, formatPrice } from '@/app/utils/pricing';

interface PaymentPageProps {}

interface BookingData {
  id: string;
  propertyId: number;
  propertyName: string;
  hostId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  priceBreakdown?: {
    price: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    payAtPropertyFee?: number;
    total: number;
  };
}

interface HostDetails {
  email: string;
  name: string;
  phone: string;
}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [hostDetails, setHostDetails] = useState<HostDetails | null>(null);
  const [fetchingBooking, setFetchingBooking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | null>(null);
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'AIRTEL' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.success) {
          setCurrentUser(response.data.data);
          // Pre-fill phone number if available
          if (response.data.data.phone) {
            setPhoneNumber(response.data.data.phone);
          }
        } else if (response.data) {
          setCurrentUser(response.data);
          if (response.data.phone) {
            setPhoneNumber(response.data.phone);
          }
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
      fetchBookingData(bookingId);
    } else {
      setErrors({ general: 'Booking ID is required' });
      setFetchingBooking(false);
    }
  }, [searchParams]);

  const fetchBookingData = async (bookingId: string) => {
    try {
      setFetchingBooking(true);
      
      const response = await api.getBooking(bookingId);
      
      if (response.data.success && response.data.data) {
        const booking = response.data.data;
        
        const nights = Math.ceil(
          (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
        );

        let propertyName = 'Property Booking';
        let hostId = booking.hostId || 1;
        let hostData: HostDetails | null = null;

        try {
          const propertyResponse = await api.getProperty(booking.propertyId);
          if (propertyResponse.data.success && propertyResponse.data.data) {
            propertyName = propertyResponse.data.data.name || propertyName;
            hostId = propertyResponse.data.data.hostId || hostId;

            // Fetch host details
            if (hostId) {
              try {
                const hostResponse = await api.get(`/users/${hostId}`);
                if (hostResponse.data.success && hostResponse.data.data) {
                  const host = hostResponse.data.data;
                  hostData = {
                    email: host.email || 'host@example.com',
                    name: `${host.firstName || 'Host'} ${host.lastName || 'Name'}`,
                    phone: host.phone || '+250788123456'
                  };
                  setHostDetails(hostData);
                }
              } catch (error) {
                console.warn('Could not fetch host details:', error);
              }
            }
          }
        } catch (error) {
          console.warn('Could not fetch property details:', error);
        }

        const displayPricePerNight = booking.totalPrice / nights;
        const priceBreakdown = calculatePriceBreakdown(displayPricePerNight, nights, false);

        setBookingData({
          id: booking.id,
          propertyId: booking.propertyId,
          propertyName,
          hostId,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          nights,
          totalPrice: booking.totalPrice,
          priceBreakdown
        });
      } else {
        setErrors({ general: 'Booking not found or invalid' });
      }
    } catch (error: any) {
      console.error('Failed to fetch booking:', error);
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

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (paymentMethod === 'momo') {
      if (!momoProvider) {
        newErrors.momoProvider = 'Please select a mobile money provider';
      }
      if (!phoneNumber || phoneNumber.trim() === '') {
        newErrors.phoneNumber = 'Phone number is required for mobile money';
      } else if (!/^(\+?250|0)?[7][0-9]{8}$/.test(phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid Rwandan phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = () => {
    if (!paymentMethod) return false;
    if (paymentMethod === 'momo') {
      return momoProvider !== null && phoneNumber.trim() !== '';
    }
    return true; // Card only needs payment method selected
  };

  const handleSubmit = async () => {
    if (!validateForm() || !bookingData || !currentUser) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const finalAmount = bookingData.priceBreakdown?.total || bookingData.totalPrice;

      // Determine endpoint based on payment method
      const endpoint = paymentMethod === 'card'
        ? '/payments/deposits'
        : '/payments/xentripay/deposits';

      // Build payload matching backend expectations
      const depositPayload = {
        // User (buyer) information
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userPhone: paymentMethod === 'momo' ? phoneNumber : (currentUser.phone || '+250788123456'),

        // Recipient (seller/host) information
        recipientId: bookingData.hostId,
        recipientEmail: hostDetails?.email || 'host@example.com',
        recipientName: hostDetails?.name || 'Host Name',
        recipientPhone: hostDetails?.phone || '+250788123456',

        // Transaction details
        amount: finalAmount,
        description: `Payment for ${bookingData.propertyName}`,
        paymentMethod,
        platformFeePercentage: undefined, // Backend will use default

        // Metadata
        metadata: {
          bookingType: 'property',
          bookingId: bookingData.id,
          propertyId: bookingData.propertyId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          nights: bookingData.nights,
          guests: bookingData.guests,
          propertyName: bookingData.propertyName,
          momoProvider: paymentMethod === 'momo' ? momoProvider : undefined
        }
      };

      console.log('[PAYMENT] Creating deposit:', {
        endpoint,
        paymentMethod,
        amount: finalAmount
      });

      // Call appropriate deposit endpoint
      const response = await api.post(endpoint, depositPayload);

      if (response.data.success) {
        const { transactionId, status, redirectUrl, instructions } = response.data.data;

        console.log('[PAYMENT] Deposit created:', { transactionId, status });

        // Store transaction ID for callback
        sessionStorage.setItem('payment_transaction_id', transactionId);
        sessionStorage.setItem('property_booking_id', bookingData.id);

        if (paymentMethod === 'card' && redirectUrl) {
          // Redirect to payment gateway for card
          window.location.href = redirectUrl;
        } else if (paymentMethod === 'momo') {
          // For MoMo, show instructions and redirect to status page
          if (instructions) {
            alert(instructions);
          }
          router.push(`/payment/pending?tx=${transactionId}`);
        }
      } else {
        setErrors({
          general: response.data.message || 'Failed to create payment. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('[PAYMENT] Deposit error:', error);

      const errorMessage = error?.response?.data?.error?.message ||
                          error?.response?.data?.message ||
                          error?.message ||
                          'Payment failed. Please try again.';

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
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
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Home
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

          input[type="text"]:focus,
          input[type="tel"]:focus {
            outline: none;
            border-color: #F20C8F;
            box-shadow: 0 0 0 3px rgba(242, 12, 143, 0.1);
          }

          input[type="radio"]:checked {
            accent-color: #F20C8F;
          }

          input[type="radio"]:focus {
            outline: 2px solid #F20C8F;
            outline-offset: 2px;
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

              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#083A85' }}>
                  Select Payment Method
                </h2>

                {errors.paymentMethod && (
                  <p className="error-message mb-3">{errors.paymentMethod}</p>
                )}

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={() => {
                        setPaymentMethod('momo');
                        setErrors({});
                      }}
                      className="h-5 w-5 cursor-pointer"
                    />
                    <span className="text-base">Mobile Money (MTN / Airtel)</span>
                  </label>

                  {paymentMethod === 'momo' && (
                    <div className="ml-8 space-y-4 pt-2">
                      {errors.momoProvider && (
                        <p className="error-message">{errors.momoProvider}</p>
                      )}

                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="momoProvider"
                            value="MTN"
                            checked={momoProvider === 'MTN'}
                            onChange={() => {
                              setMomoProvider('MTN');
                              setErrors({});
                            }}
                            className="h-4 w-4 cursor-pointer"
                          />
                          <span>MTN MoMo</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="momoProvider"
                            value="AIRTEL"
                            checked={momoProvider === 'AIRTEL'}
                            onChange={() => {
                              setMomoProvider('AIRTEL');
                              setErrors({});
                            }}
                            className="h-4 w-4 cursor-pointer"
                          />
                          <span>Airtel Money</span>
                        </label>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setErrors({});
                          }}
                          placeholder="e.g., 0788123456"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all ${
                            errors.phoneNumber ? 'error-input' : 'border-gray-300'
                          }`}
                        />
                        {errors.phoneNumber && (
                          <p className="error-message">{errors.phoneNumber}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Enter your mobile money number
                        </p>
                      </div>
                    </div>
                  )}

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => {
                        setPaymentMethod('card');
                        setMomoProvider(null);
                        setErrors({});
                      }}
                      className="h-5 w-5 cursor-pointer"
                    />
                    <span className="text-base">Credit/Debit Card</span>
                  </label>
                </div>
              </div>

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
                      <span className="text-gray-600">Subtotal ({bookingData.nights} nights)</span>
                      <span className="font-medium">${bookingData.priceBreakdown?.subtotal || bookingData.totalPrice}</span>
                    </div>
                    
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Taxes (4%)</span>
                      <span className="font-medium">${bookingData.priceBreakdown?.taxes || 0}</span>
                    </div>
                    
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold" style={{ color: '#083A85' }}>Total</span>
                      <span className="font-bold text-lg" style={{ color: '#083A85' }}>
                        ${bookingData.priceBreakdown?.total || bookingData.totalPrice}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormComplete()}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all ${
                      loading || !isFormComplete()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'cursor-pointer hover:opacity-90'
                    }`}
                    style={(loading || !isFormComplete()) ? {} : { backgroundColor: '#F20C8F' }}>
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
                        Pay ${bookingData.priceBreakdown?.total || bookingData.totalPrice} Securely
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

            {/* Right Side - Property Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4 p-4">
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#083A85' }}>
                  {bookingData?.propertyName || 'Property Booking'}
                </h3>
                
                {bookingData && (
                  <>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">
                          {new Date(bookingData.checkIn).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">
                          {new Date(bookingData.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nights:</span>
                        <span className="font-medium">{bookingData.nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{bookingData.guests}</span>
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

export default PaymentPage;