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
  hostId: number; // Add hostId for escrow
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

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'airtel' | 'mpesa' | 'pay_at_property' | null>(null);
  const [isLoggedIn] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [fetchingBooking, setFetchingBooking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form data states
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [mobileData, setMobileData] = useState({
    phoneNumber: ''
  });

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

  // Update price breakdown when payment method changes
  useEffect(() => {
    if (bookingData) {
      
      const displayPricePerNight = bookingData.totalPrice / bookingData.nights;
      const isPayAtProperty = paymentMethod === 'pay_at_property';
      
      const updatedBreakdown = calculatePriceBreakdown(
        displayPricePerNight, 
        bookingData.nights, 
        isPayAtProperty
      );
      
      setBookingData(prev => prev ? {
        ...prev,
        priceBreakdown: updatedBreakdown
      } : null);
    }
  }, [paymentMethod, bookingData?.totalPrice, bookingData?.nights]);

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
        let hostId = booking.hostId || 1; // Default to 1 if not provided
        
        try {
          const propertyResponse = await api.getProperty(booking.propertyId);
          if (propertyResponse.data.success && propertyResponse.data.data) {
            propertyName = propertyResponse.data.data.name || propertyName;
            hostId = propertyResponse.data.data.hostId || hostId;
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

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }

    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    }

    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMobileInputChange = (value: string) => {
    let formattedValue = value;
    
    if (paymentMethod === 'momo' && !value.startsWith('+250')) {
      formattedValue = value.replace(/^\+?250?/, '+250 ');
    } else if (paymentMethod === 'mpesa' && !value.startsWith('+254')) {
      formattedValue = value.replace(/^\+?254?/, '+254 ');
    }

    setMobileData({ phoneNumber: formattedValue });
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (paymentMethod === 'card') {
      if (!cardData.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardData.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Card number is too short';
      }

      if (!cardData.cardholderName) {
        newErrors.cardholderName = 'Cardholder name is required';
      }

      if (!cardData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      }

      if (!cardData.cvv) {
        newErrors.cvv = 'CVV is required';
      }
    }

    if (paymentMethod && ['momo', 'airtel', 'mpesa'].includes(paymentMethod)) {
      if (!mobileData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      }
    }

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

      const finalAmount = bookingData.priceBreakdown?.total || bookingData.totalPrice;

      // ==================== ESCROW INTEGRATION ====================
      // Create deposit through Pesapal Escrow API
      const depositPayload = {
        amount: finalAmount,
        currency: 'USD', // US Dollar
        reference: `BOOKING-${bookingData.id}-${Date.now()}`,
        description: `Payment for ${bookingData.propertyName}`,
        hostId: bookingData.hostId,
        agentId: undefined, // Set if you have agent system
        splitRules: {
          host: 78.95,      // Host gets 78.95%
          agent: 4.39,      // Agent gets 8.77%
          platform: 16.67   // Platform gets 12.28%
        },
        billingInfo: {
          email: currentUser.email,
          phone: mobileData.phoneNumber || currentUser.phone || '+250788123456',
          firstName: currentUser.firstName || cardData.cardholderName?.split(' ')[0] || 'Guest',
          lastName: currentUser.lastName || cardData.cardholderName?.split(' ').slice(1).join(' ') || 'User',
          countryCode: 'RW'
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
        sessionStorage.setItem('booking_id', bookingData.id);

        // Redirect to Pesapal payment page
        window.location.href = checkoutUrl;
      } else {
        setErrors({ 
          general: response.data.message || 'Failed to create payment. Please try again.' 
        });
      }
    } catch (error: any) {
      console.error('[PAYMENT] Escrow deposit error:', error);
      
      const errorMessage = JSON.stringify(error.data.error.details.errors[0]) || 
                          error?.response?.data?.error?.message || 
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
        <title>Confirm and Pay - Secure Escrow Payment</title>
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
          {/* Escrow Security Banner */}
          <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="bi bi-shield-check text-2xl text-green-600 mr-3"></i>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Escrow Payment</h3>
                <p className="text-sm text-gray-600">
                  Your payment is protected in escrow until check-in is confirmed. 
                  Funds are held securely and only released to the host after successful check-in.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Side - Payment Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              
              {/* Step 1: Payment Method Selection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-medium text-white mr-3"
                    style={{ backgroundColor: '#F20C8F' }}>
                    1
                  </div>
                  <h2 className="text-lg font-semibold" style={{ color: '#083A85' }}>
                    Select payment method
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
                    style={{ borderColor: paymentMethod === 'momo' ? '#F20C8F' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="mr-3"
                      style={{ accentColor: '#F20C8F' }}
                    />
                    <i className="bi bi-phone mr-3 text-xl" style={{ color: '#083A85' }}></i>
                    <div className="flex-1">
                      <div className="font-medium">Mobile Money (MoMo)</div>
                      <div className="text-base text-gray-500">MTN Mobile Money - Secure & Fast</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
                    style={{ borderColor: paymentMethod === 'airtel' ? '#F20C8F' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="airtel"
                      checked={paymentMethod === 'airtel'}
                      onChange={() => setPaymentMethod('airtel')}
                      className="mr-3"
                      style={{ accentColor: '#F20C8F' }}
                    />
                    <i className="bi bi-phone mr-3 text-xl" style={{ color: '#083A85' }}></i>
                    <div className="flex-1">
                      <div className="font-medium">Airtel Money</div>
                      <div className="text-base text-gray-500">Airtel Mobile Money</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
                    style={{ borderColor: paymentMethod === 'card' ? '#F20C8F' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mr-3"
                      style={{ accentColor: '#F20C8F' }}
                    />
                    <i className="bi bi-credit-card mr-3 text-xl" style={{ color: '#083A85' }}></i>
                    <div className="flex-1">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-base text-gray-500">Visa, Mastercard, Amex</div>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && <p className="error-message mt-2">{errors.paymentMethod}</p>}
              </div>

              {/* Step 2: Payment Details */}
              {paymentMethod && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-medium text-white mr-3"
                      style={{ backgroundColor: '#F20C8F' }}>
                      2
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: '#083A85' }}>
                      Enter payment details
                    </h2>
                  </div>

                  {(paymentMethod === 'momo' || paymentMethod === 'airtel') && (
                    <div>
                      <label className="block text-base font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+250 7XX XXX XXX"
                        value={mobileData.phoneNumber}
                        onChange={(e) => handleMobileInputChange(e.target.value)}
                        className={`w-full p-3 border rounded-lg text-base ${errors.phoneNumber ? 'error-input' : 'border-gray-300'}`}
                      />
                      {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
                      <p className="text-base text-gray-500 mt-2">
                        Enter your {paymentMethod === 'momo' ? 'MTN Mobile Money' : 'Airtel Money'} number
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Order Summary and Submit */}
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
                      <span className="font-semibold" style={{ color: '#083A85' }}>Total (Held in Escrow)</span>
                      <span className="font-bold text-lg" style={{ color: '#083A85' }}>
                        ${bookingData.priceBreakdown?.total || bookingData.totalPrice}
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
                        <i className="bi bi-shield-check mr-2"></i>
                        Pay ${bookingData.priceBreakdown?.total || bookingData.totalPrice} Securely
                      </>
                    )}
                  </button>
                  
                  <p className="text-base text-gray-500 mt-4 text-center">
                    <i className="bi bi-lock-fill mr-1"></i>
                    Secured by Pesapal Escrow • Funds protected until check-in
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

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start">
                    <i className="bi bi-shield-check text-green-600 mr-2 mt-1"></i>
                    <div className="text-xs text-green-800">
                      <div className="font-semibold mb-1">Escrow Protection</div>
                      <div>Your payment is held securely until check-in is confirmed</div>
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