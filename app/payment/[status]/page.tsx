// app/payment/[status]/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  fundedAt?: string;
  releasedAt?: string;
  refundedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  splitAmounts?: {
    host: number;
    agent: number;
    platform: number;
  };
  guest?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  host?: {
    firstName: string;
    lastName: string;
    email: string;
  };
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

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const status = params.status as 'success' | 'failed' | 'pending' | 'error';
  const ref = searchParams.get('ref');
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [statusChanged, setStatusChanged] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  /**
   * Fetch transaction with status check
   * This uses the new /status endpoint that automatically checks Pesapal
   */
  const fetchTransactionStatus = useCallback(async () => {
    if (!ref) {
      setLoading(false);
      return;
    }

    try {
      setChecking(true);
      console.log(`[PAYMENT_PAGE] Checking status for: ${ref}`);
      
      const response = await fetch(`${API_URL}/payments/transactions/reference/${ref}/status`);
      const data: StatusCheckResponse = await response.json();

      if (data.success && data.data.transaction) {
        const { transaction: txn, statusChanged: changed, oldStatus, newStatus } = data.data;
        
        setTransaction(txn);
        setStatusChanged(changed);
        setLastChecked(new Date());
        
        if (changed) {
          console.log(`[PAYMENT_PAGE] Status changed: ${oldStatus} → ${newStatus}`);
        }
        
        return txn;
      } else {
        console.error('[PAYMENT_PAGE] Failed to fetch transaction:', data);
      }
    } catch (err) {
      console.error('[PAYMENT_PAGE] Error fetching transaction:', err);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, [ref, API_URL]);

  // Initial fetch
  useEffect(() => {
    fetchTransactionStatus();
  }, [fetchTransactionStatus]);

  // Auto-refresh for pending transactions
  useEffect(() => {
    if (!transaction || transaction.status !== 'PENDING') {
      return;
    }

    // Refresh every 10 seconds for pending transactions
    const interval = setInterval(() => {
      console.log('[PAYMENT_PAGE] Auto-refreshing...');
      fetchTransactionStatus();
      setRefreshCount(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [transaction, fetchTransactionStatus]);

  const handleManualRefresh = () => {
    fetchTransactionStatus();
  };

  const getActualStatus = (): 'success' | 'failed' | 'pending' | 'error' => {
    if (!transaction) return status;
    
    switch (transaction.status) {
      case 'HELD':
      case 'RELEASED':
        return 'success';
      case 'FAILED':
      case 'CANCELLED':
        return 'failed';
      case 'PENDING':
        return 'pending';
      default:
        return status;
    }
  };

  const actualStatus = getActualStatus();

  const getStatusConfig = () => {
    switch (actualStatus) {
      case 'success':
        return {
          icon: 'bi-check-circle-fill',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          title: 'Payment successful',
          message: transaction?.status === 'HELD' 
            ? 'Your payment has been received and is being held in escrow securely.'
            : 'Your payment has been processed successfully.',
          buttonText: 'Go to Dashboard',
          buttonIcon: 'bi-house-door',
          actionUrl: '/dashboard'
        };
      case 'failed':
        return {
          icon: 'bi-x-circle-fill',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          title: 'Payment failed',
          message: transaction?.cancellationReason || error || 'Your payment could not be processed. Please try again or contact support.',
          buttonText: 'Try Again',
          buttonIcon: 'bi-arrow-clockwise',
          actionUrl: window.location.href
        };
      case 'pending':
        return {
          icon: 'bi-clock-fill',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          title: 'Payment processing',
          message: 'Your payment is being verified. This usually takes 1-3 minutes.',
          buttonText: 'Refresh Status',
          buttonIcon: 'bi-arrow-clockwise',
          actionUrl: ''
        };
      default:
        return {
          icon: 'bi-exclamation-triangle-fill',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          iconBg: 'bg-orange-100',
          title: 'Processing error',
          message: message || 'There was an error processing your payment. Please contact support.',
          buttonText: 'Contact Support',
          buttonIcon: 'bi-headset',
          actionUrl: '/support'
        };
    }
  };

  const config = getStatusConfig();

  const handlePrimaryAction = () => {
    if (actualStatus === 'pending') {
      handleManualRefresh();
    } else if (config.actionUrl) {
      window.location.href = config.actionUrl;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'RWF') {
      return `FRw ${Math.round(amount).toLocaleString()}`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSinceLastCheck = () => {
    if (!lastChecked) return null;
    const seconds = Math.floor((Date.now() - lastChecked.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  if (loading) {
    return (
      <>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
          rel="stylesheet" 
        />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#083A85] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-10 py-4 flex items-center">
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Payment Status</h1>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-12">
          {/* Status change notification */}
          {statusChanged && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <i className="bi bi-info-circle-fill text-blue-600 text-lg"></i>
                <p className="text-sm font-medium text-blue-900">
                  Status updated! Your payment status has changed.
                </p>
              </div>
            </div>
          )}

          {/* Main status card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Status Header */}
            <div className={`${config.bgColor} p-8 text-center border-b`}>
              <div className="mb-6">
                {checking ? (
                  <div className="mx-auto w-20 h-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#083A85]"></div>
                  </div>
                ) : (
                  <div className={`mx-auto w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center`}>
                    <i className={`${config.icon} text-4xl ${config.color}`}></i>
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                {config.title}
              </h1>

              <p className="text-gray-600 max-w-md mx-auto">
                {config.message}
              </p>
            </div>

            {/* Transaction Details */}
            {transaction && (
              <div className="p-6 space-y-4">
                {/* Amount Card */}
                <div className="rounded-xl border bg-gray-50 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Amount paid</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      transaction.status === 'HELD' || transaction.status === 'RELEASED' 
                        ? 'bg-green-100 text-green-700'
                        : transaction.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : transaction.status === 'FAILED' || transaction.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>

                {/* Reference Number */}
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500 mb-2">Transaction reference</p>
                  <p className="font-mono text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg break-all">
                    {transaction.reference}
                  </p>
                </div>

                {/* Description */}
                {transaction.description && (
                  <div className="rounded-xl border p-4">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-700">{transaction.description}</p>
                  </div>
                )}

                {/* Split Amounts (for successful payments) */}
                {transaction.splitAmounts && actualStatus === 'success' && (
                  <div className="rounded-xl border p-4">
                    <p className="text-sm text-gray-500 mb-3">Payment distribution</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Host payment</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.splitAmounts.host, transaction.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Agent commission</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.splitAmounts.agent, transaction.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Platform fee</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.splitAmounts.platform, transaction.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500 mb-3">Timeline</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</span>
                    </div>
                    {transaction.fundedAt && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-green-600">
                          <i className="bi bi-check-circle mr-1"></i>Funded
                        </span>
                        <span className="text-sm text-gray-900">{formatDate(transaction.fundedAt)}</span>
                      </div>
                    )}
                    {transaction.cancelledAt && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-red-600">
                          <i className="bi bi-x-circle mr-1"></i>Cancelled
                        </span>
                        <span className="text-sm text-gray-900">{formatDate(transaction.cancelledAt)}</span>
                      </div>
                    )}
                    {lastChecked && (
                      <div className="flex justify-between items-center py-1 border-t pt-2">
                        <span className="text-sm text-gray-500">Last checked</span>
                        <span className="text-sm text-gray-500">{getTimeSinceLastCheck()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Failure Reason */}
                {transaction.cancellationReason && actualStatus === 'failed' && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex gap-3">
                      <i className="bi bi-exclamation-circle text-red-600 text-lg mt-0.5"></i>
                      <div>
                        <p className="text-sm font-medium text-red-900 mb-1">
                          Failure reason
                        </p>
                        <p className="text-sm text-red-700">
                          {transaction.cancellationReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-refresh indicator for pending */}
                {actualStatus === 'pending' && (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {checking ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#083A85]"></div>
                            <span className="text-sm text-gray-700">Checking status...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-repeat text-yellow-600 text-lg"></i>
                            <span className="text-sm text-gray-700">Auto-refreshing every 10 seconds</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full">
                        {refreshCount} checks
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t space-y-3">
              <button
                onClick={handlePrimaryAction}
                disabled={checking}
                className={`w-full flex justify-center items-center gap-2 px-6 py-3.5 rounded-lg text-white font-medium transition-all ${
                  checking 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : actualStatus === 'success' 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                    : actualStatus === 'failed'
                    ? 'bg-[#083A85] hover:bg-[#062a5f]'
                    : actualStatus === 'pending'
                    ? 'bg-[#083A85] hover:bg-[#062a5f]'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {checking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <i className={`${config.buttonIcon}`}></i>
                    <span>{config.buttonText}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex justify-center items-center gap-2 px-6 py-3.5 border border-gray-300 rounded-lg text-gray-700 font-medium bg-white hover:bg-gray-50 transition-all"
              >
                <i className="bi bi-arrow-left"></i>
                <span>Back to Home</span>
              </button>
            </div>

            {/* Help Section */}
            {actualStatus === 'pending' && (
              <div className="px-6 pb-6">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <i className="bi bi-info-circle-fill text-blue-600 text-lg mt-0.5"></i>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        What's happening?
                      </p>
                      <p className="text-sm text-blue-700">
                        Mobile money payments typically take 2-5 minutes to process. The system automatically checks the status every 10 seconds. You can also manually refresh using the button above.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Support Contact Card */}
          <div className="mt-6 rounded-xl border bg-white p-6 text-center">
            <p className="text-sm text-gray-500 mb-3">Need help with your payment?</p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="mailto:finance@amoriaglobal.com" 
                className="flex items-center gap-2 text-sm font-medium text-[#083A85] hover:underline"
              >
                <i className="bi bi-envelope-fill"></i>
                <span>finance@amoriaglobal.com</span>
              </a>
              <span className="text-gray-300">•</span>
              <a 
                href="tel:+250788437347" 
                className="flex items-center gap-2 text-sm font-medium text-[#083A85] hover:underline"
              >
                <i className="bi bi-telephone-fill"></i>
                <span>+250 788 437 347</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}