import api from '@/app/api/apiService';
import React, { useState } from 'react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form
  React.useEffect(() => {
    const isValid = newPassword.length >= 6 && 
                   confirmPassword.length >= 6 && 
                   newPassword === confirmPassword;
    setIsFormValid(isValid);
    
    if (confirmPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please ensure passwords match and are at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const pendingEmail = localStorage.getItem('pendingVerificationEmail');
      const token = localStorage.getItem('authToken');
      // Use your API service to update password
      const response = await api.post('/auth/setup-password', {
        email: pendingEmail,
        token, // Include token if required by your API
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });

      console.log('Password updated successfully:', response);
      
      // Success
      onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error('Password update failed:', error);
      
      // Handle error message from your API structure
      const errorMessage = error.response?.data?.message || 
                          error.data?.message ||
                          error.message || 
                          'Failed to update password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl lg:text-2xl font-bold">Set Your Password</h2>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white/90 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Field */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-white/90 text-sm lg:text-base font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 lg:py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300 text-sm lg:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 focus:outline-none transition-colors duration-200"
              >
                {showNewPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-white/90 text-sm lg:text-base font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 lg:py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300 text-sm lg:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 focus:outline-none transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg px-4 py-2">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Password Requirements */}
          <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-lg px-4 py-3">
            <p className="text-blue-200 text-sm mb-2 font-medium">Password Requirements:</p>
            <ul className="text-blue-200/80 text-xs space-y-1">
              <li className={`flex items-center ${newPassword.length >= 6 ? 'text-green-300' : ''}`}>
                <span className="mr-2">{newPassword.length >= 6 ? '✓' : '•'}</span>
                At least 6 characters long
              </li>
              <li className={`flex items-center ${newPassword === confirmPassword && confirmPassword ? 'text-green-300' : ''}`}>
                <span className="mr-2">{newPassword === confirmPassword && confirmPassword ? '✓' : '•'}</span>
                Passwords must match
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 lg:py-3 px-4 rounded-xl font-semibold text-sm lg:text-base border border-white/30 text-white/90 hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`flex-1 py-2.5 lg:py-3 px-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-white hover:scale-[1.02]'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
              }`}
            >
              {loading ? 'Updating...' : 'Set Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;