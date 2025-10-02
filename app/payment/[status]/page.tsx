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
          title: 'Payment Successful!',
          message: transaction?.status === 'HELD' 
            ? 'Your payment has been received and is being held in escrow securely.'
            : 'Your payment has been processed successfully.',
          buttonText: 'Go to Dashboard',
          actionUrl: '/dashboard'
        };
      case 'failed':
        return {
          icon: 'bi-x-circle-fill',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Payment Failed',
          message: transaction?.cancellationReason || error || 'Your payment could not be processed. Please try again or contact support.',
          buttonText: 'Try Again',
          actionUrl: window.location.href
        };
      case 'pending':
        return {
          icon: 'bi-clock-fill',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Payment Processing',
          message: 'Your payment is being verified. This usually takes 1-3 minutes.',
          buttonText: 'Refresh Status',
          actionUrl: ''
        };
      default:
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#083A85' }}></div>
            <p className="mt-4 text-gray-600 font-medium">Loading payment status...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      
      <div className="mt-12 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-6">
          {/* Status change notification */}
          {statusChanged && (
            <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4 shadow-md animate-pulse">
              <div className="flex items-center">
                <i className="bi bi-info-circle-fill text-blue-600 text-xl mr-3"></i>
                <p className="text-sm font-semibold text-blue-900">
                  Status Updated! The payment status has changed.
                </p>
              </div>
            </div>
          )}

          {/* Main status card */}
          <div className={`rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-8 shadow-lg`}>
            {/* Status Icon & Title */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center mb-6">
                {checking ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: '#083A85' }}></div>
                ) : (
                  <i className={`${config.icon} text-7xl ${config.color}`}></i>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {config.title}
              </h1>

              <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto">
                {config.message}
              </p>
            </div>

            {/* Transaction Details */}
            {transaction && (
              <div className="mt-8 space-y-3">
                {/* Amount - Highlighted */}
                <div className="bg-white rounded-lg p-5 border-2 border-gray-300 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                </div>

                {/* Reference */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    Transaction Reference
                  </p>
                  <p className="text-sm font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">
                    {transaction.reference}
                  </p>
                </div>

                {/* Status Badge with Last Checked */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Current Status</span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      transaction.status === 'HELD' || transaction.status === 'RELEASED' 
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : transaction.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        : transaction.status === 'FAILED' || transaction.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  {lastChecked && (
                    <p className="text-xs text-gray-400">
                      Last checked: {getTimeSinceLastCheck()}
                    </p>
                  )}
                </div>

                {/* Description */}
                {transaction.description && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                      Description
                    </p>
                    <p className="text-sm text-gray-700">
                      {transaction.description}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Created:</span>
                    <span className="font-medium text-gray-900">{formatDate(transaction.createdAt)}</span>
                  </div>
                  {transaction.fundedAt && (
                    <div className="flex justify-between text-gray-600">
                      <span className="text-green-600">✓ Funded:</span>
                      <span className="font-medium text-gray-900">{formatDate(transaction.fundedAt)}</span>
                    </div>
                  )}
                  {transaction.cancelledAt && (
                    <div className="flex justify-between text-gray-600">
                      <span className="text-red-600">✗ Cancelled:</span>
                      <span className="font-medium text-gray-900">{formatDate(transaction.cancelledAt)}</span>
                    </div>
                  )}
                </div>

                {/* Split Amounts (for successful payments) */}
                {transaction.splitAmounts && actualStatus === 'success' && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                      Payment Distribution
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Host Payment:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(transaction.splitAmounts.host, transaction.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Agent Commission:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(transaction.splitAmounts.agent, transaction.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Platform Fee:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(transaction.splitAmounts.platform, transaction.currency)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Failure Reason */}
                {transaction.cancellationReason && actualStatus === 'failed' && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-start">
                      <i className="bi bi-exclamation-circle text-red-600 mr-2 mt-0.5"></i>
                      <div>
                        <p className="text-xs text-red-700 uppercase tracking-wide font-semibold mb-1">
                          Failure Reason
                        </p>
                        <p className="text-sm text-red-800">
                          {transaction.cancellationReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auto-refresh indicator for pending */}
            {actualStatus === 'pending' && transaction && (
              <div className="mt-6 p-4 bg-white rounded-lg border-2 border-yellow-300 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-700">
                  {checking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: '#083A85' }}></div>
                      <span>Checking status...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-repeat mr-2 text-yellow-600"></i>
                      <span>Auto-refreshing every 10 seconds</span>
                    </>
                  )}
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {refreshCount} checks
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handlePrimaryAction}
                disabled={checking}
                className="w-full flex justify-center items-center px-6 py-4 border border-transparent text-base font-semibold rounded-lg text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                style={{ 
                  backgroundColor: actualStatus === 'success' ? '#083A85' : 
                                   actualStatus === 'failed' ? '#dc2626' :
                                   actualStatus === 'pending' ? '#ca8a04' : '#ea580c'
                }}
              >
                {checking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Checking...
                  </>
                ) : (
                  <>
                    {actualStatus === 'pending' && <i className="bi bi-arrow-clockwise mr-2"></i>}
                    {actualStatus === 'success' && <i className="bi bi-house-door mr-2"></i>}
                    {actualStatus === 'failed' && <i className="bi bi-credit-card mr-2"></i>}
                    {actualStatus === 'error' && <i className="bi bi-headset mr-2"></i>}
                    {config.buttonText}
                  </>
                )}
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex justify-center items-center px-6 py-4 border-2 text-base font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                style={{ 
                  borderColor: '#083A85',
                  color: '#083A85',
                  backgroundColor: 'white'
                }}
              >
                <i className="bi bi-house mr-2"></i>
                Back to Home
              </button>
            </div>

            {/* Info for Pending Status */}
            {actualStatus === 'pending' && (
              <div className="mt-6 p-4 rounded-lg border-2" style={{ backgroundColor: '#f0f4ff', borderColor: '#083A85' }}>
                <div className="flex items-start">
                  <i className="bi bi-info-circle-fill mr-3 mt-0.5 text-lg" style={{ color: '#083A85' }}></i>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: '#083A85' }}>
                      What's happening?
                    </p>
                    <p className="text-xs text-gray-700">
                      Mobile money payments typically take 2-5 minutes to process. The system automatically checks the status every 10 seconds. You can also manually refresh using the button above.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Support Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Need help with your payment?
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <a 
                    href="mailto:finance@amoriaglobal.com" 
                    className="flex items-center hover:underline transition-colors"
                    style={{ color: '#083A85' }}
                  >
                    <i className="bi bi-envelope mr-1"></i>
                    finance@amoriaglobal.com
                  </a>
                  <span className="text-gray-300">|</span>
                  <a 
                    href="tel:+250788437347" 
                    className="flex items-center hover:underline transition-colors"
                    style={{ color: '#083A85' }}
                  >
                    <i className="bi bi-telephone mr-1"></i>
                    +250 788 437 347
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}