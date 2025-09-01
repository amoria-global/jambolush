//app/all/property/[id]/confirm-and-pay/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../../api/apiService';

interface PaymentPageProps {}

interface BookingData {
  propertyId: number;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  priceBreakdown?: {
    basePrice: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    total: number;
  };
}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [paymentTiming, setPaymentTiming] = useState<'now' | 'later' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'airtel' | 'mpesa' | null>(null);
  const [isLoggedIn] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

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

  // Load booking data from URL params and validate
  useEffect(() => {
    const propertyId = searchParams.get('propertyId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    if (propertyId && checkIn && checkOut && guests) {
      const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Validate booking and get pricing
      const validateAndSetBooking = async () => {
        try {
          const validation = await api.validateBooking(
            parseInt(propertyId),
            checkIn,
            checkOut,
            parseInt(guests)
          );

          if (validation.data.success && validation.data.data.priceBreakdown) {
            setBookingData({
              propertyId: parseInt(propertyId),
              propertyName: 'Property Booking', // This could be fetched from property API
              checkIn,
              checkOut,
              guests: parseInt(guests),
              nights,
              priceBreakdown: validation.data.data.priceBreakdown
            });
          } else {
            // Fallback with estimated pricing
            const basePrice = 150; // This should come from property data
            setBookingData({
              propertyId: parseInt(propertyId),
              propertyName: 'Property Booking',
              checkIn,
              checkOut,
              guests: parseInt(guests),
              nights,
              priceBreakdown: {
                basePrice,
                subtotal: basePrice * nights,
                cleaningFee: 35,
                serviceFee: 25,
                taxes: Math.round((basePrice * nights + 35 + 25) * 0.08),
                total: Math.round((basePrice * nights + 35 + 25) * 1.08)
              }
            });
          }
        } catch (error) {
          console.error('Booking validation failed:', error);
          // Set fallback data
          const basePrice = 150;
          setBookingData({
            propertyId: parseInt(propertyId),
            propertyName: 'Property Booking',
            checkIn,
            checkOut,
            guests: parseInt(guests),
            nights,
            priceBreakdown: {
              basePrice,
              subtotal: basePrice * nights,
              cleaningFee: 35,
              serviceFee: 25,
              taxes: Math.round((basePrice * nights + 35 + 25) * 0.08),
              total: Math.round((basePrice * nights + 35 + 25) * 1.08)
            }
          });
        }
      };

      validateAndSetBooking();
    } else {
      // Redirect back if missing data
      router.push('/');
    }
  }, [searchParams, router]);

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;

    // Format card number
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }

    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    }

    // Format CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMobileInputChange = (value: string) => {
    let formattedValue = value;
    
    // Auto-format phone numbers
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

    // Validate payment timing
    if (!paymentTiming) {
      newErrors.paymentTiming = 'Please select when you want to pay';
    }

    // Validate payment method and fields for "pay now"
    if (paymentTiming === 'now') {
      if (!paymentMethod) {
        newErrors.paymentMethod = 'Please select a payment method';
      }

      // Validate card fields
      if (paymentMethod === 'card') {
        if (!cardData.cardNumber.replace(/\s/g, '')) {
          newErrors.cardNumber = 'Card number is required';
        } else if (cardData.cardNumber.replace(/\s/g, '').length < 13) {
          newErrors.cardNumber = 'Card number is too short';
        }

        if (!cardData.cardholderName) {
          newErrors.cardholderName = 'Cardholder name is required';
        } else if (cardData.cardholderName.length < 2) {
          newErrors.cardholderName = 'Cardholder name is too short';
        }

        if (!cardData.expiryDate) {
          newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
          newErrors.expiryDate = 'Expiry date must be MM/YY format';
        } else {
          // Validate expiry date is not in the past
          const [month, year] = cardData.expiryDate.split('/');
          const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const now = new Date();
          now.setDate(1);
          if (expiryDate < now) {
            newErrors.expiryDate = 'Card has expired';
          }
        }

        if (!cardData.cvv) {
          newErrors.cvv = 'CVV is required';
        } else if (cardData.cvv.length < 3) {
          newErrors.cvv = 'CVV must be at least 3 digits';
        }
      }

      // Validate mobile money fields
      if (paymentMethod && ['momo', 'airtel', 'mpesa'].includes(paymentMethod)) {
        if (!mobileData.phoneNumber) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (mobileData.phoneNumber.length < 10) {
          newErrors.phoneNumber = 'Phone number is too short';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !bookingData) {
      return;
    }

    // Add explicit check for paymentTiming to satisfy TypeScript
    if (!paymentTiming) {
      setErrors({ general: 'Please select when you want to pay' });
      return;
    }

    // Add explicit check for paymentMethod when paying now
    if (paymentTiming === 'now' && !paymentMethod) {
      setErrors({ general: 'Please select a payment method' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Build base payload
      const bookingPayload: any = {
        propertyId: bookingData.propertyId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: bookingData.priceBreakdown?.total || 0,
        paymentTiming,
        paymentMethod: paymentTiming === 'now' ? paymentMethod : 'property',
        message: ''
      };

      // Add payment details based on method
      if (paymentTiming === 'now' && paymentMethod) {
        if (paymentMethod === 'card') {
          bookingPayload.cardDetails = {
            cardNumber: cardData.cardNumber.replace(/\s/g, ''),
            expiryDate: cardData.expiryDate,
            cvv: cardData.cvv,
            cardholderName: cardData.cardholderName
          };
        } else if (['momo', 'airtel', 'mpesa'].includes(paymentMethod)) {
          bookingPayload.mobileDetails = {
            phoneNumber: mobileData.phoneNumber
          };
        }
      }

      const response = await api.createBooking(bookingPayload);

      if (response.data.success) {
        const bookingId = response.data.data.id;
        const confirmationCode = response.data.data.confirmationCode;
        
        // Redirect to booking confirmation page
        router.push(`/booking-confirmation/${bookingId}?code=${confirmationCode}`);
      } else {
        setErrors({ general: response.data.message || 'Failed to create booking' });
      }
    } catch (error: any) {
      console.error('Booking creation error:', error);
      const errorMessage = error?.response?.data?.message || 
                         error?.response?.data?.errors?.join(', ') ||
                         error?.message || 
                         'Failed to create booking. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const canShowPaymentMethods = paymentTiming === 'now';
  const canShowPaymentForm = paymentTiming === 'now' && paymentMethod;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
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
        
        @media (max-width: 768px) {
          .property-card {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Side - Payment Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Step 1: Payment Timing - Always visible */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-medium text-white mr-3"
                  style={{ backgroundColor: '#F20C8F' }}>
                  1
                </div>
                <h2 className="text-lg font-semibold" style={{ color: '#083A85' }}>
                  Choose when to pay
                </h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
                  style={{ borderColor: paymentTiming === 'now' ? '#F20C8F' : '#e5e7eb' }}>
                  <input
                    type="radio"
                    name="payment-timing"
                    value="now"
                    checked={paymentTiming === 'now'}
                    onChange={() => setPaymentTiming('now')}
                    className="mr-3"
                    style={{ accentColor: '#F20C8F' }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">Pay now</div>
                    <div className="text-base text-gray-500">Complete payment immediately</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
                  style={{ borderColor: paymentTiming === 'later' ? '#F20C8F' : '#e5e7eb' }}>
                  <input
                    type="radio"
                    name="payment-timing"
                    value="later"
                    checked={paymentTiming === 'later'}
                    onChange={() => setPaymentTiming('later')}
                    className="mr-3"
                    style={{ accentColor: '#F20C8F' }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">Pay at property</div>
                    <div className="text-base text-gray-500">Pay when you arrive</div>
                  </div>
                </label>
              </div>
              {errors.paymentTiming && <p className="error-message mt-2">{errors.paymentTiming}</p>}
            </div>

            {/* Step 2: Payment Method - Visible when "Pay now" is selected */}
            {canShowPaymentMethods && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-medium text-white mr-3"
                    style={{ backgroundColor: '#F20C8F' }}>
                    2
                  </div>
                  <h2 className="text-lg font-semibold" style={{ color: '#083A85' }}>
                    Select payment method
                  </h2>
                </div>
                
                <div className="space-y-3">
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
                      <div className="text-base text-gray-500">MTN Mobile Money</div>
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
                    style={{ borderColor: paymentMethod === 'mpesa' ? '#F20C8F' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={() => setPaymentMethod('mpesa')}
                      className="mr-3"
                      style={{ accentColor: '#F20C8F' }}
                    />
                    <i className="bi bi-cash mr-3 text-xl" style={{ color: '#083A85' }}></i>
                    <div className="flex-1">
                      <div className="font-medium">M-Pesa</div>
                      <div className="text-base text-gray-500">Safaricom M-Pesa</div>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && <p className="error-message mt-2">{errors.paymentMethod}</p>}
              </div>
            )}

            {/* Step 3: Payment Details - Visible when payment method is selected */}
            {canShowPaymentForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-medium text-white mr-3"
                    style={{ backgroundColor: '#F20C8F' }}>
                    3
                  </div>
                  <h2 className="text-lg font-semibold" style={{ color: '#083A85' }}>
                    Enter payment details
                  </h2>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-medium mb-2">Card Number *</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                        className={`w-full p-3 border rounded-lg text-base ${errors.cardNumber ? 'error-input' : 'border-gray-300'}`}
                      />
                      {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-base font-medium mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardData.cardholderName}
                        onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                        className={`w-full p-3 border rounded-lg text-base ${errors.cardholderName ? 'error-input' : 'border-gray-300'}`}
                      />
                      {errors.cardholderName && <p className="error-message">{errors.cardholderName}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                          className={`w-full p-3 border rounded-lg text-base ${errors.expiryDate ? 'error-input' : 'border-gray-300'}`}
                        />
                        {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-base font-medium mb-2">CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                          className={`w-full p-3 border rounded-lg text-base ${errors.cvv ? 'error-input' : 'border-gray-300'}`}
                        />
                        {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {(paymentMethod === 'momo' || paymentMethod === 'airtel' || paymentMethod === 'mpesa') && (
                  <div>
                    <label className="block text-base font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder={
                        paymentMethod === 'momo' ? '+250 7XX XXX XXX' :
                        paymentMethod === 'airtel' ? '+250 7XX XXX XXX' : '+254 7XX XXX XXX'
                      }
                      value={mobileData.phoneNumber}
                      onChange={(e) => handleMobileInputChange(e.target.value)}
                      className={`w-full p-3 border rounded-lg text-base ${errors.phoneNumber ? 'error-input' : 'border-gray-300'}`}
                    />
                    {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
                    <p className="text-base text-gray-500 mt-2">
                      {paymentMethod === 'momo' ? 'Enter your MTN Mobile Money number' :
                       paymentMethod === 'airtel' ? 'Enter your Airtel Money number' : 'Enter your M-Pesa number'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Summary and Submit - Always visible once payment timing is selected */}
            {paymentTiming && bookingData && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#083A85' }}>
                  Order Summary
                </h2>
                
                {/* General Error Display */}
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
                    <span className="text-gray-600">Property ({bookingData.nights} nights)</span>
                    <span className="font-medium">${bookingData.priceBreakdown?.subtotal || 0}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span className="font-medium">${bookingData.priceBreakdown?.cleaningFee || 35}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">${bookingData.priceBreakdown?.serviceFee || 25}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">${bookingData.priceBreakdown?.taxes || 0}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold" style={{ color: '#083A85' }}>Total</span>
                    <span className="font-bold text-lg" style={{ color: '#083A85' }}>
                      ${bookingData.priceBreakdown?.total || 0}
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
                      {paymentTiming === 'now' ? 'Processing...' : 'Creating Booking...'}
                    </>
                  ) : (
                    paymentTiming === 'now' ? 'Complete Payment' : 'Confirm Reservation'
                  )}
                </button>
                
                <p className="text-base text-gray-500 mt-4 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>

          {/* Right Side - Property Preview */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="property-card bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              
              {/* Property Image */}
              <div className="relative h-40 sm:h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop"
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Property Name */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg" style={{ color: '#083A85' }}>
                  {bookingData?.propertyName || 'Property Booking'}
                </h3>
                <div className="flex items-center mt-1 text-base text-gray-600">
                  <i className="bi bi-geo-alt mr-1"></i>
                  Booking Confirmation
                </div>
              </div>
              
              {/* Check-in/Check-out */}
              {bookingData && (
                <div className="p-4 border-b">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-base text-gray-500 mb-1">CHECK-IN</div>
                      <div className="font-medium text-base">
                        {new Date(bookingData.checkIn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-base text-gray-500">3:00 PM</div>
                    </div>
                    <div>
                      <div className="text-base text-gray-500 mb-1">CHECK-OUT</div>
                      <div className="font-medium text-base">
                        {new Date(bookingData.checkOut).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-base text-gray-500">11:00 AM</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Booking Details */}
              {bookingData && (
                <div className="p-4 border-b">
                  <h4 className="font-medium text-base mb-3" style={{ color: '#083A85' }}>
                    Booking Details
                  </h4>
                  <ul className="space-y-2 text-base">
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <i className="bi bi-calendar-check mr-2 flex-shrink-0" style={{ color: '#F20C8F' }}></i>
                        <span>Duration</span>
                      </span>
                      <span className="font-medium">{bookingData.nights} nights</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <i className="bi bi-people mr-2 flex-shrink-0" style={{ color: '#F20C8F' }}></i>
                        <span>Guests</span>
                      </span>
                      <span className="font-medium">{bookingData.guests}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <i className="bi bi-currency-dollar mr-2 flex-shrink-0" style={{ color: '#F20C8F' }}></i>
                        <span>Total</span>
                      </span>
                      <span className="font-bold" style={{ color: '#083A85' }}>
                        ${bookingData.priceBreakdown?.total || 0}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
              
              {/* Security Message */}
              <div className="p-4 text-center">
                <p className="text-base text-gray-500">
                  <i className="bi bi-shield-check mr-1" style={{ color: '#F20C8F' }}></i>
                  Your booking is protected by our guarantee
                </p>
                <p className="text-base text-gray-400 mt-2">
                  Secure payment processing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;