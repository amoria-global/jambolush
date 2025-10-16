'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

// --- Type Definitions ---
interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  fundedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

interface StatusCheckResponse {
  success: boolean;
  data: {
    transaction: Transaction;
    statusChanged: boolean;
    oldStatus?: string;
    newStatus?: string;
  };
}

interface PawapayResponse {
  success: boolean;
  data: {
    depositId: string;
    status: string;
    amount: string;
    currency: string;
    country: string;
    payer: {
      type: string;
      accountDetails: {
        phoneNumber: string;
        provider: string;
      };
    };
    customerMessage: string;
    created: string;
    failureReason?: {
      failureMessage: string;
      failureCode: string;
    };
    metadata: {
      checkIn: string;
      checkOut: string;
      clientReferenceId: string;
      propertyId: string;
      userId: string;
      bookingId: string;
    };
  };
}

// --- Helper Components ---
const Spinner = ({ size = 'h-8 w-8', color = 'border-gray-500' }: { size?: string, color?: string }) => (
  <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}></div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-neutral-600">{label}</p>
    <p className="font-medium text-neutral-800 text-right break-all">{value}</p>
  </div>
);

// --- Main Page Component ---
export default function PaymentStatusPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const initialStatus = params.status as 'success' | 'failed' | 'pending' | 'error';
  const ref = searchParams.get('ref');
  const tx = searchParams.get('tx');
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(20);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchTransactionStatus = useCallback(async () => {
    if (!ref && !tx) {
      setLoading(false);
      return;
    }
    setIsChecking(true);
    try {
      let endpoint = '';
      if (ref) {
        endpoint = `/payments/transactions/reference/${ref}/status`;
      } else if (tx) {
        endpoint = `/pawapay/deposit/${tx}`;
      }
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const apiData: StatusCheckResponse | PawapayResponse = await response.json();

      if (apiData.success) {
        let txData: Transaction;
        if (ref) {
          txData = (apiData as StatusCheckResponse).data.transaction;
        } else {
          const pawapayData = (apiData as PawapayResponse).data;
          txData = {
            id: pawapayData.depositId,
            reference: pawapayData.depositId, // or pawapayData.metadata.clientReferenceId if preferred
            amount: parseFloat(pawapayData.amount),
            currency: pawapayData.currency,
            status: pawapayData.status,
            description: pawapayData.customerMessage || `Payment for booking ${pawapayData.metadata.bookingId} (${new Date(pawapayData.metadata.checkIn).toLocaleDateString()} - ${new Date(pawapayData.metadata.checkOut).toLocaleDateString()})`,
            createdAt: pawapayData.created,
            fundedAt: pawapayData.status === 'COMPLETED' ? pawapayData.created : undefined,
            cancelledAt: pawapayData.status === 'FAILED' ? pawapayData.created : undefined,
            cancellationReason: pawapayData.failureReason?.failureMessage,
          };
        }
        setTransaction(txData);
      } else {
        console.error('Failed to fetch transaction status:', apiData);
      }
    } catch (err) {
      console.error('Error fetching transaction status:', err);
    } finally {
      setLoading(false);
      setIsChecking(false);
    }
  }, [ref, tx, API_URL]);

  // Initial fetch
  useEffect(() => {
    fetchTransactionStatus();
  }, [fetchTransactionStatus]);
  
  const getActualStatus = (): 'success' | 'failed' | 'pending' | 'error' => {
    if (!transaction) return loading ? 'pending' : initialStatus;
    switch (transaction.status) {
      case 'HELD':
      case 'RELEASED':
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
      case 'CANCELLED':
        return 'failed';
      case 'PENDING':
      case 'SUBMITTED':
        return 'pending';
      default:
        return 'error';
    }
  };
  
  const actualStatus = getActualStatus();

  // Auto-refresh for pending transactions
  useEffect(() => {
    if (actualStatus !== 'pending') return;

    const interval = setInterval(() => {
      fetchTransactionStatus();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [actualStatus, fetchTransactionStatus]);

  // Redirect logic for successful transactions
  useEffect(() => {
    if (actualStatus !== 'success') return;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      const authToken = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      const redirectUrl = new URL('https://app.jambolush.com/all/guest/bookings');
      if (authToken) redirectUrl.searchParams.append('authToken', authToken);
      if (refreshToken) redirectUrl.searchParams.append('refreshToken', refreshToken);
      
      window.location.href = redirectUrl.toString();
    }, 20000); // 20 seconds delay

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, [actualStatus]);

  const getStatusConfig = () => {
    switch (actualStatus) {
      case 'success':
        return {
          iconClass: 'bi-check-circle-fill',
          color: 'text-green-500',
          title: 'Payment successful!',
          message: `Your booking is confirmed. We're preparing your details and will redirect you to your bookings page shortly.`,
        };
      case 'failed':
        return {
          iconClass: 'bi-x-circle-fill',
          color: 'text-red-500',
          title: 'Payment failed',
          message: transaction?.cancellationReason || 'Your payment could not be processed. Please go back and try again.',
        };
      case 'pending':
        return {
          iconClass: 'bi-clock-history',
          color: 'text-yellow-500',
          title: 'Payment is processing',
          message: 'This can take a few minutes. We are waiting for confirmation from the payment provider. This page will update automatically.',
        };
      default:
        return {
          iconClass: 'bi-exclamation-triangle-fill',
          color: 'text-orange-500',
          title: 'An error occurred',
          message: 'Something went wrong while processing your payment. Please contact support.',
        };
    }
  };
  
  const config = getStatusConfig();
  
  const handleGoBack = () => window.history.back();
  const handleGoHome = () => window.location.href = '/';
  
  const formatCurrency = (amount: number, currency: string) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Spinner size="h-12 w-12" />
        <p className="mt-4 text-sm text-neutral-600">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-12">

      <main className="max-w-md mx-auto py-8 px-4 sm:py-16 sm:px-0">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 sm:p-8">
          
          {/* Status Icon & Title */}
          <div className="text-center">
            {actualStatus === 'pending' ? (
              <div className="flex justify-center mb-4">
                <Spinner color="border-yellow-500" />
              </div>
            ) : (
              <i className={`text-5xl mb-4 ${config.iconClass} ${config.color}`}></i>
            )}
            <h1 className="text-xl font-semibold text-neutral-800">{config.title}</h1>
            <p className="text-sm text-neutral-600 mt-2">{config.message}</p>
          </div>

          {/* Success Countdown */}
          {actualStatus === 'success' && (
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-500">Redirecting in...</p>
              <p className="text-2xl font-bold text-[#FF385C]">{countdown}s</p>
            </div>
          )}

          {/* Transaction Details */}
          {transaction && (
            <>
              <hr className="my-6" />
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-xl">
                  <p className="text-xs text-neutral-500">Amount Paid</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                </div>
                <div className="space-y-3">
                  <DetailRow label="Date" value={formatDate(transaction.createdAt)} />
                  <DetailRow label="Reference" value={transaction.reference} />
                  <DetailRow label="Status" value={transaction.status} />
                  <DetailRow label="Description" value={transaction.description} />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            {actualStatus === 'failed' && (
              <button
                onClick={handleGoBack}
                className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg text-white font-semibold transition-all bg-[#FF385C] hover:bg-[#E01C54]"
              >
                <i className="bi bi-arrow-left"></i>
                <span>Go Back & Try Again</span>
              </button>
            )}
             {actualStatus !== 'success' && (
               <button
                onClick={handleGoHome}
                className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-neutral-300 rounded-lg text-neutral-700 font-semibold bg-white hover:bg-neutral-50 transition-all"
              >
                <i className="bi bi-house-door-fill"></i>
                <span>Back to Home</span>
              </button>
             )}
          </div>

        </div>

        {/* Support Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500">
            Need help?{' '}
            <a href="mailto:support@jambolush.com" className="font-semibold text-[#FF385C] hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}