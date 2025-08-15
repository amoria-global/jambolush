"use client";
import React, { useState } from 'react';

interface PaymentPageProps {}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const [paymentTiming, setPaymentTiming] = useState<'now' | 'later'>('now');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'mpesa'>('card');
  const [isLoggedIn] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Payment Timing */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#083A85' }}>
                Choose when to pay
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
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
                    <div className="text-sm text-gray-500">Complete payment immediately</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
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
                    <div className="text-sm text-gray-500">Pay when you arrive</div>
                  </div>
                </label>
              </div>
              
              {paymentTiming === 'now' && (
                <button className="mt-4 text-sm underline" style={{ color: '#F20C8F' }}>
                  Change selection
                </button>
              )}
            </div>

            {/* Step 2: Payment Method */}
            {paymentTiming === 'now' && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#083A85' }}>
                  Add payment method
                </h2>
                
                {isLoggedIn && (
                  <div className="mb-3 text-sm text-gray-600 flex items-center">
                    <i className="bi bi-check-circle-fill mr-2" style={{ color: '#F20C8F' }}></i>
                    Payment method auto-selected from your account
                  </div>
                )}
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
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
                      <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
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
                      <div className="text-sm text-gray-500">MTN Mobile Money</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300"
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
                      <div className="text-sm text-gray-500">Safaricom M-Pesa</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Review and Proceed */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#083A85' }}>
                Review and proceed
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Property (3 nights)</span>
                  <span className="font-medium">$450.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span className="font-medium">$35.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">$25.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold" style={{ color: '#083A85' }}>Total</span>
                  <span className="font-bold text-lg" style={{ color: '#083A85' }}>$510.00</span>
                </div>
              </div>
              
              <button 
                className="w-full py-3 px-6 rounded-lg text-white font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#F20C8F' }}>
                {paymentTiming === 'now' ? 'Confirm and Pay' : 'Confirm Reservation'}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          {/* Right Side - Property Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop"
                  alt="Modern House"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Property Name */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg" style={{ color: '#083A85' }}>
                  Luxury Villa with Ocean View
                </h3>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <i className="bi bi-geo-alt mr-1"></i>
                  Malibu, California
                </div>
              </div>
              
              {/* Check-in/Check-out */}
              <div className="p-4 border-b">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">CHECK-IN</div>
                    <div className="font-medium text-sm">Dec 24, 2024</div>
                    <div className="text-xs text-gray-500">3:00 PM</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">CHECK-OUT</div>
                    <div className="font-medium text-sm">Dec 27, 2024</div>
                    <div className="text-xs text-gray-500">11:00 AM</div>
                  </div>
                </div>
              </div>
              
              {/* Amenities List */}
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm mb-3" style={{ color: '#083A85' }}>
                  Property Features
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <i className="bi bi-house-door mr-2" style={{ color: '#F20C8F' }}></i>
                    <span>Spacious Living Room</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-door-open mr-2" style={{ color: '#F20C8F' }}></i>
                    <span>4 Bedrooms</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-droplet mr-2" style={{ color: '#F20C8F' }}></i>
                    <span>3 Bathrooms</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-wifi mr-2" style={{ color: '#F20C8F' }}></i>
                    <span>High-Speed WiFi</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-car-front mr-2" style={{ color: '#F20C8F' }}></i>
                    <span>Free Parking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-water mr-2" style={{ color: '#F20C8F' }}></i>
                    <span>Private Pool</span>
                  </li>
                </ul>
              </div>
              
              {/* Closing Text */}
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500">
                  <i className="bi bi-shield-check mr-1" style={{ color: '#F20C8F' }}></i>
                  Your booking is protected by our guarantee
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Need help? Contact support 24/7
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