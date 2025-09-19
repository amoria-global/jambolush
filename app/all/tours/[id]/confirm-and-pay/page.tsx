"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/app/api/apiService';
import { decodeId } from '@/app/utils/encoder';
import { calculatePriceBreakdown, getBasePriceFromDisplay, formatPrice } from '@/app/utils/pricing';
import AlertNotification from '@/app/components/notify';

interface TourPaymentPageProps {}

interface TourBookingData {
  id: string;
  tourId: number;
  tourTitle: string;
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
  totalAmount: number; // This will be the display price from booking
  pricePerPerson: number; // Display price per person
  basePricePerPerson: number; // Base price per person (calculated)
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
    payAtTourFee?: number;
  };
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

const TourPaymentPage: React.FC<TourPaymentPageProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'airtel' | 'mpesa' | 'pay_at_tour' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<TourBookingData | any |null>(null);
  const [fetchingBooking, setFetchingBooking] = useState(true);

  // Alert state
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'info'
  });

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

  // Alert functions
  const showAlert = (message: string, type: AlertState['type'], duration = 5000) => {
    setAlert({ show: true, message, type, duration });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Update price breakdown when payment method changes
  useEffect(() => {
    if (bookingData) {
      const isPayAtTour = paymentMethod === 'pay_at_tour';
      
      // Calculate base price per person from display price
      const basePricePerPerson = bookingData.basePricePerPerson || getBasePriceFromDisplay(bookingData.pricePerPerson);
      
      // Use the pricing utility for tours (treating as 1 "night" since tours are per-person pricing)
      const updatedBreakdown = calculatePriceBreakdown(
        basePricePerPerson, 
        bookingData.numberOfParticipants, // Use participants as "nights" for calculation
        isPayAtTour
      );
      
      setBookingData((prev: any) => prev ? {
        ...prev,
        priceBreakdown: {
          basePrice: basePricePerPerson,
          displayPrice: basePricePerPerson * 1.10, // 10% markup
          subtotal: basePricePerPerson * 1.10 * bookingData.numberOfParticipants,
          serviceFee: updatedBreakdown.serviceFee,
          taxes: updatedBreakdown.taxes,
          total: updatedBreakdown.total,
          payAtTourFee: isPayAtTour ? updatedBreakdown.payAtPropertyFee : undefined
        }
      } : null);
    }
  }, [paymentMethod, bookingData?.totalAmount, bookingData?.numberOfParticipants]);

  // Load booking data from booking ID
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
      
      // Fetch tour booking details from API
      const response = await api.get(`/tours/guest/bookings/${bookingId}`);
      
      if (response.data.success && response.data.data) {
        const booking = response.data.data;
        
        // Get additional tour details if needed
        let tourDetails = null;
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
          }
        } catch (error) {
          console.warn('Could not fetch tour details:', error);
        }

        // Get schedule details
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

        // Calculate pricing - totalAmount from booking is display price
        const displayPricePerPerson = booking.totalAmount / booking.numberOfParticipants;
        const basePricePerPerson = getBasePriceFromDisplay(displayPricePerPerson);
        
        // Calculate initial price breakdown (without pay at tour fee)
        const priceBreakdown = calculatePriceBreakdown(basePricePerPerson, booking.numberOfParticipants, false);

        setBookingData({
          id: booking.id,
          tourId: booking.tourId,
          tourTitle: booking.tourTitle || 'Tour Experience',
          scheduleId: booking.scheduleId,
          ...scheduleDetails,
          numberOfParticipants: booking.numberOfParticipants,
          participants: booking.participants || [],
          totalAmount: booking.totalAmount, // Display price total
          pricePerPerson: displayPricePerPerson, // Display price per person
          basePricePerPerson: basePricePerPerson, // Base price per person
          status: booking.status,
          specialRequests: booking.specialRequests,
          tourDetails,
          priceBreakdown: {
            basePrice: basePricePerPerson,
            displayPrice: displayPricePerPerson,
            subtotal: displayPricePerPerson * booking.numberOfParticipants,
            serviceFee: priceBreakdown.serviceFee,
            taxes: priceBreakdown.taxes,
            total: priceBreakdown.total,
            payAtTourFee: undefined
          }
        });

        showAlert('Booking details loaded successfully', 'success', 3000);
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

    // Validate payment method
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !bookingData) {
      return;
    }

    if (!paymentMethod) {
      setErrors({ general: 'Please select a payment method' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Use the current total (which includes pay at tour fee if selected)
      const finalAmount = bookingData.priceBreakdown?.total || bookingData.totalAmount;

      // Build payment payload for tour booking
      const paymentPayload: any = {
        bookingId: bookingData.id,
        bookingType: 'tour',
        amount: finalAmount,
        paymentMethod: paymentMethod,
        
        // Required fields
        currency: 'USD',
        reference: `tour_booking_${bookingData.id}_${Date.now()}`,
        description: `Payment for ${bookingData.tourTitle} tour booking`,
        
        // Tour-specific data
        tourId: bookingData.tourId,
        scheduleId: bookingData.scheduleId,
        numberOfParticipants: bookingData.numberOfParticipants,
        
        // Escrow terms for tour bookings
        escrowTerms: {
          type: paymentMethod === 'pay_at_tour' ? 'manual' : 'automatic',
          description: paymentMethod === 'pay_at_tour' 
            ? 'Payment to be made at tour meeting point with 10% convenience fee'
            : 'Automatic release upon successful tour completion',
          conditions: paymentMethod === 'pay_at_tour'
            ? [
                'Payment must be made at tour meeting point before start',
                'Tour must be available as described', 
                'Guest agrees to 10% convenience fee for pay-at-tour option'
              ]
            : [
                'Tour is available as described',
                'Tour guide and equipment ready as scheduled',
                'No disputes raised within 24 hours of tour completion'
              ],
          autoRelease: {
            enabled: paymentMethod !== 'pay_at_tour',
            date: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString() // 3 days from now
          },
          disputeSettings: {
            deadline: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)).toISOString() // 14 days from now
          }
        }
      };

      // Add payment details based on payment method
      if (paymentMethod === 'card') {
        paymentPayload.cardDetails = {
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
          cardholderName: cardData.cardholderName
        };
      } else if (['momo', 'airtel', 'mpesa'].includes(paymentMethod)) {
        paymentPayload.phoneNumber = mobileData.phoneNumber;
        paymentPayload.paymentDetails = {
          type: 'mobile_money',
          provider: paymentMethod
        };
      } else if (paymentMethod === 'pay_at_tour') {
        paymentPayload.paymentDetails = {
          type: 'pay_at_tour',
          convenienceFee: bookingData.priceBreakdown?.payAtTourFee || 0,
          originalAmount: bookingData.totalAmount,
          feePercentage: 10
        };
        paymentPayload.requiresTourPayment = true;
      }

      const response = await api.post('/payments/deposit', paymentPayload);

      if (response.data.success) {
        const transactionId = response.data.data.transactionId;
        const confirmationCode = response.data.data.confirmationCode;
        
        showAlert('Payment processed successfully!', 'success');
        
        // Redirect to tour payment confirmation page
        setTimeout(() => {
          router.push(`/tours/payment-confirmation/${bookingData.id}?transaction=${transactionId}&code=${confirmationCode}&payAtTour=${paymentMethod === 'pay_at_tour'}`);
        }, 2000);
      } else {
        setErrors({ general: response.data.message || 'Payment processing failed' });
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      const errorMessage = error?.response?.data?.message || 
                        error?.response?.data?.errors?.join(', ') ||
                        error?.message || 
                        'Payment failed. Please try again.';
      setErrors({ general: errorMessage });
      showAlert(`Payment failed: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Loading state while fetching booking
  if (fetchingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F20C8F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (errors.general && !bookingData) {
    let returnPath = "/tours";
    if (errors.general.includes('401') || errors.general.includes('Authentication')) {
      returnPath = "/all/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search);
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <i className="bi bi-exclamation-triangle-fill text-4xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tour Booking Not Found</h2>
          <p className="text-gray-600 mb-4">{errors.general}</p>
          <button 
            onClick={() => router.push(returnPath)}
            className="px-6 py-2 bg-[#F20C8F] text-white rounded-lg hover:bg-opacity-90"
          >
            {!errors.general.includes('401') && !errors.general.includes('Authentication') ? 'Browse Tours' : 'Login to Continue'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>Confirm and Pay - {bookingData?.tourTitle}</title>
      </head>
      
      {/* Alert Notification */}
      {alert.show && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          position="top-center"
          duration={alert.duration}
          onClose={hideAlert}
          showProgress={true}
          autoHide={true}
        />
      )}
      
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
        <style jsx>{`
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
            .tour-card {
              position: relative !important;
              top: 0 !important;
            }
          }
        `}</style>
        
        <div className="max-w-7xl mx-auto mt-14">
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

                  {/* Pay at Tour Option */}
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
                    style={{ borderColor: paymentMethod === 'pay_at_tour' ? '#F20C8F' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="pay_at_tour"
                      checked={paymentMethod === 'pay_at_tour'}
                      onChange={() => setPaymentMethod('pay_at_tour')}
                      className="mr-3"
                      style={{ accentColor: '#F20C8F' }}
                    />
                    <i className="bi bi-house mr-3 text-xl" style={{ color: '#083A85' }}></i>
                    <div className="flex-1">
                      <div className="font-medium">Pay at Tour Start</div>
                      <div className="text-base text-gray-500">Pay at meeting point (+10% convenience fee)</div>
                    </div>
                    {paymentMethod === 'pay_at_tour' && (
                      <div className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                        +10% Fee
                      </div>
                    )}
                  </label>
                </div>
                {errors.paymentMethod && <p className="error-message mt-2">{errors.paymentMethod}</p>}
              </div>

              {/* Step 2: Payment Details - Visible when payment method is selected */}
              {paymentMethod && paymentMethod !== 'pay_at_tour' && (
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

              {/* Pay at Tour Information */}
              {paymentMethod === 'pay_at_tour' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-medium text-white mr-3"
                      style={{ backgroundColor: '#F20C8F' }}>
                      2
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: '#083A85' }}>
                      Pay at Tour Start Details
                    </h2>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <i className="bi bi-info-circle-fill text-orange-600 mr-3 mt-1"></i>
                      <div>
                        <h4 className="font-medium text-orange-800 mb-2">Important Information</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• A 10% convenience fee is added for paying at tour start</li>
                          <li>• Payment must be made at the meeting point before tour begins</li>
                          <li>• Cash or card payments are typically accepted</li>
                          <li>• Your booking is confirmed, but payment is required before tour start</li>
                          <li>• Please arrive 15 minutes early for payment processing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">What to expect:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="bi bi-check-circle-fill text-green-600 mr-2"></i>
                        Your booking is confirmed immediately
                      </div>
                      <div className="flex items-center">
                        <i className="bi bi-clock-fill text-blue-600 mr-2"></i>
                        Payment due at tour meeting point
                      </div>
                      <div className="flex items-center">
                        <i className="bi bi-calculator-fill text-purple-600 mr-2"></i>
                        Total amount includes 10% convenience fee
                      </div>
                      <div className="flex items-center">
                        <i className="bi bi-geo-alt-fill text-[#F20C8F] mr-2"></i>
                        Meeting point: {bookingData?.tourDetails?.meetingPoint || 'Details provided in confirmation'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary and Submit */}
              {bookingData && (
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
                    {/* Price Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Base Price ({bookingData.numberOfParticipants} participants × ${bookingData.priceBreakdown?.basePrice})</span>
                        <span>${Math.round((bookingData.priceBreakdown?.basePrice || 0) * bookingData.numberOfParticipants)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Display Markup (10%)</span>
                        <span>+${Math.round((bookingData.priceBreakdown?.basePrice || 0) * bookingData.numberOfParticipants * 0.10)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-base font-medium">
                        <span>Subtotal (Display Price)</span>
                        <span>${bookingData.priceBreakdown?.subtotal || 0}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">${bookingData.priceBreakdown?.serviceFee || 0}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Taxes (4%)</span>
                      <span className="font-medium">${bookingData.priceBreakdown?.taxes || 0}</span>
                    </div>
                    
                    {/* Show pay at tour fee if applicable */}
                    {paymentMethod === 'pay_at_tour' && bookingData.priceBreakdown?.payAtTourFee && (
                      <div className="flex justify-between text-base">
                        <span className="text-orange-600">Pay at Tour Fee (10%)</span>
                        <span className="font-medium text-orange-600">+${bookingData.priceBreakdown.payAtTourFee}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold" style={{ color: '#083A85' }}>Total</span>
                      <span className={`font-bold text-lg ${paymentMethod === 'pay_at_tour' ? 'text-orange-600' : ''}`} 
                            style={paymentMethod !== 'pay_at_tour' ? { color: '#083A85' } : {}}>
                        ${bookingData.priceBreakdown?.total || bookingData.totalAmount}
                      </span>
                    </div>
                    
                    {/* Show savings for other payment methods */}
                    {paymentMethod && paymentMethod !== 'pay_at_tour' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                        <p className="text-green-700 text-sm font-medium">
                          <i className="bi bi-check-circle-fill mr-2"></i>
                          You're saving ${Math.round(bookingData.totalAmount * 0.1)} by paying online!
                        </p>
                      </div>
                    )}
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
                        {paymentMethod === 'pay_at_tour' ? 'Confirming Booking...' : 'Processing Payment...'}
                      </>
                    ) : (
                      paymentMethod === 'pay_at_tour' ? 'Confirm Booking' : 'Complete Payment'
                    )}
                  </button>
                  
                  <p className="text-base text-gray-500 mt-4 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Tour Preview */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="tour-card bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
                
                {/* Tour Image */}
                <div className="relative h-40 sm:h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={bookingData?.tourDetails?.images?.main?.[0] || "https://images.unsplash.com/photo-1464822759844-d150f39cbae2?w=500&h=300&fit=crop"}
                    alt="Tour"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Tour Name */}
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg" style={{ color: '#083A85' }}>
                    {bookingData?.tourTitle || 'Tour Experience'}
                  </h3>
                  <div className="flex items-center mt-1 text-base text-gray-600">
                    <i className="bi bi-geo-alt mr-1"></i>
                    {bookingData?.tourDetails?.locationCity}, {bookingData?.tourDetails?.locationCountry}
                  </div>
                </div>
                
                {/* Tour Schedule */}
                {bookingData && (
                  <div className="p-4 border-b">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-base text-gray-500 mb-1">TOUR DATE</div>
                        <div className="font-medium text-base">
                          {formatDate(bookingData.scheduleDate)}
                        </div>
                        <div className="text-base text-gray-500">
                          {bookingData.scheduleStartTime} - {bookingData.scheduleEndTime}
                        </div>
                      </div>
                      {bookingData.tourDetails?.duration && (
                        <div>
                          <div className="text-base text-gray-500 mb-1">DURATION</div>
                          <div className="font-medium text-base">
                            {Math.floor(bookingData.tourDetails.duration / 24)} days
                          </div>
                          <div className="text-base text-gray-500">
                            {bookingData.tourDetails.difficulty} difficulty
                          </div>
                        </div>
                      )}
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
                          <i className="bi bi-people mr-2 flex-shrink-0" style={{ color: '#F20C8F' }}></i>
                          <span>Participants</span>
                        </span>
                        <span className="font-medium">{bookingData.numberOfParticipants}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="flex items-center">
                          <i className="bi bi-currency-dollar mr-2 flex-shrink-0" style={{ color: '#F20C8F' }}></i>
                          <span>Price per person</span>
                        </span>
                        <div className="text-right">
                          <span className="font-medium">${bookingData.pricePerPerson}</span>
                          {bookingData.basePricePerPerson && (
                            <div className="text-xs text-gray-500 line-through">${bookingData.basePricePerPerson}</div>
                          )}
                        </div>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="flex items-center">
                          <i className="bi bi-receipt mr-2 flex-shrink-0" style={{ color: '#F20C8F' }}></i>
                          <span>Total</span>
                        </span>
                        <span className={`font-bold ${paymentMethod === 'pay_at_tour' ? 'text-orange-600' : ''}`} 
                              style={paymentMethod !== 'pay_at_tour' ? { color: '#083A85' } : {}}>
                          ${bookingData.priceBreakdown?.total || 0}
                        </span>
                      </li>
                      {paymentMethod === 'pay_at_tour' && (
                        <li className="flex items-center justify-between text-sm text-orange-600">
                          <span className="flex items-center">
                            <i className="bi bi-info-circle mr-2 flex-shrink-0"></i>
                            <span>Includes 10% fee</span>
                          </span>
                          <span>+${bookingData.priceBreakdown?.payAtTourFee || 0}</span>
                        </li>
                      )}
                      <li className="flex items-center justify-between">
                        <span className="flex items-center">
                          <i className="bi bi-check-circle mr-2 flex-shrink-0" style={{ color: '#F20C8F' }}></i>
                          <span>Status</span>
                        </span>
                        <span className="font-medium text-green-600 capitalize">{bookingData.status}</span>
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
                    {paymentMethod === 'pay_at_tour' ? 'Payment due at tour start' : 'Secure payment processing'}
                  </p>
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