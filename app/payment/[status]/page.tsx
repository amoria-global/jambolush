// app/payment/[status]/page.tsx
'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const status = params.status as 'success' | 'failed' | 'pending' | 'error';
  const ref = searchParams.get('ref');
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: 'bi-check-circle-fill',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
          buttonText: 'Continue to Dashboard',
          actionUrl: ''
        };
      case 'failed':
        return {
          icon: 'bi-x-circle-fill',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Payment Failed',
          message: error || 'Your payment could not be processed. Please try again or contact support.',
          buttonText: 'Try Again',
          actionUrl: '/payment'
        };
      case 'pending':
        return {
          icon: 'bi-clock-fill',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Payment Pending',
          message: 'Your payment is being processed. This may take a few minutes. Please check back later.',
          buttonText: 'Refresh Status',
          actionUrl: ''
        };
      case 'error':
        return {
          icon: 'bi-exclamation-triangle-fill',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Processing Error',
          message: message || 'There was an error processing your payment. Please contact support.',
          buttonText: 'Contact Support',
          actionUrl: '/support'
        };
      default:
        return {
          icon: 'bi-clock',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Processing...',
          message: 'Please wait while we process your payment.',
          buttonText: 'Please Wait',
          actionUrl: '#'
        };
    }
  };

  const config = getStatusConfig();

  const handlePrimaryAction = () => {
    if (status === 'pending') {
      window.location.reload();
    } else if (config.actionUrl) {
      window.location.href = config.actionUrl;
    }
  };

  const handleSecondaryAction = () => {
    window.location.href = '/';
  };

  return (
    <>
      {/* Bootstrap Icons CDN */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-8 text-center shadow-lg`}>
            {/* Status Icon */}
            <div className="mx-auto flex items-center justify-center">
              <i className={`${config.icon} text-6xl ${config.color}`}></i>
            </div>

            {/* Title */}
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {config.title}
            </h2>

            {/* Message */}
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {config.message}
            </p>

            {/* Reference Number */}
            {ref && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Transaction Reference
                </p>
                <p className="mt-1 text-sm font-mono text-gray-900 break-all">
                  {ref}
                </p>
              </div>
            )}

            {/* Error Details */}
            {(error || message) && status !== 'failed' && (
              <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Details
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  {error || message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handlePrimaryAction}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200"
                style={{ 
                  backgroundColor: status === 'success' ? '#083A85' : 
                                   status === 'failed' ? '#dc2626' :
                                   status === 'pending' ? '#ca8a04' :
                                   status === 'error' ? '#ea580c' : '#6b7280'
                }}
                onMouseEnter={(e) => {
                  const hoverColors = {
                    success: '#062766',
                    failed: '#b91c1c',
                    pending: '#a16207',
                    error: '#c2410c'
                  };
                  e.currentTarget.style.backgroundColor = hoverColors[status as keyof typeof hoverColors] || '#6b7280';
                }}
                onMouseLeave={(e) => {
                  const originalColors = {
                    success: '#083A85',
                    failed: '#dc2626',
                    pending: '#ca8a04',
                    error: '#ea580c'
                  };
                  e.currentTarget.style.backgroundColor = originalColors[status as keyof typeof originalColors] || '#6b7280';
                }}
              >
                {status === 'pending' && <i className="bi bi-arrow-clockwise mr-2"></i>}
                {status === 'success' && <i className="bi bi-house mr-2"></i>}
                {status === 'failed' && <i className="bi bi-credit-card mr-2"></i>}
                {status === 'error' && <i className="bi bi-headset mr-2"></i>}
                {config.buttonText}
              </button>

              <button
                onClick={handleSecondaryAction}
                className="w-full flex justify-center items-center px-4 py-3 border text-sm font-medium rounded-md text-white transition-colors duration-200"
                style={{ 
                  backgroundColor: '#083A85',
                  borderColor: '#083A85'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#062766';
                  e.currentTarget.style.borderColor = '#062766';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#083A85';
                  e.currentTarget.style.borderColor = '#083A85';
                }}
              >
                <i className="bi bi-house mr-2"></i>
                Back to Home
              </button>
            </div>

            {/* Additional Info for Pending Status */}
            {status === 'pending' && (
              <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#f0f4ff', borderColor: '#083A85' }}>
                <div className="flex items-start">
                  <i className="bi bi-info-circle-fill mr-2 mt-0.5" style={{ color: '#083A85' }}></i>
                  <p className="text-xs font-medium" style={{ color: '#083A85' }}>
                    Mobile money payments may take 2-5 minutes to process. You'll receive an SMS confirmation when complete.
                  </p>
                </div>
              </div>
            )}

            {/* Support Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <i className="bi bi-headset mr-2 text-gray-400"></i>
                <p className="text-xs text-gray-500">
                  Need help? Contact our support team at{' '}
                  <a 
                    href="mailto:support@yourapp.com" 
                    className="hover:underline"
                    style={{ color: '#083A85' }}
                  >
                    support@yourapp.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* URL Info */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
            <p><strong>Current URL:</strong> /payment/{status}</p>
            {ref && <p><strong>Reference:</strong> {ref}</p>}
          </div>
        </div>
      </div>
    </>
  );
}