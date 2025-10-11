import { useState, useEffect } from "react";
import api from "../../api/apiService"; 
import AlertNotification from "../notify";

interface AddReviewFormProps {
  propertyId: number;
  onClose: () => void;
  onAddReview?: (review: { 
    id: number; 
    name: string; 
    date: string; 
    rating: number; 
    comment: string;
    propertyId: number;
  }) => void;
}

const AddReviewForm = ({ propertyId, onClose, onAddReview }: AddReviewFormProps) => {
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    images: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSubmitting, onClose]);

  const handleReviewSubmit = async () => {
    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      setError('Please provide a rating and comment');
      return;
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      setError('Please select a rating between 1 and 5 stars');
      return;
    }

    if (reviewForm.comment.trim().length < 10) {
      setError('Comment must be at least 10 characters long');
      return;
    }

    if (reviewForm.comment.trim().length > 2000) {
      setError('Comment cannot exceed 2000 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to submit a review. Please sign in and try again.');
        setIsSubmitting(false);
        return;
      }

      // Set auth token for API call
      api.setAuth(token);

      // Call the backend API with propertyId in the request body
      const response = await api.addPropertyReview({
        propertyId: propertyId,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        images: reviewForm.images.length > 0 ? reviewForm.images : undefined
      });

      if (response.data.success) {
        // Success - show animation
        setShowSuccessAnimation(true);
        
        // Call the callback with the new review data
        const newReview = response.data.data;
        
        // Wait for animation to show
        setTimeout(() => {
          onAddReview?.({
            id: newReview.id,
            name: newReview.userName || newReview.guestName || 'Anonymous',
            date: 'Just now',
            rating: newReview.rating,
            comment: newReview.comment || newReview.reviewText,
            propertyId: propertyId
          });

          // Reset form and close modal
          setReviewForm({
            rating: 0,
            comment: '',
            images: []
          });

          onClose();
        }, 1500);

      } else {
        setError(response.data.message || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      // Handle different types of errors based on backend responses
      if (error.response?.status === 401) {
        setError('You must be logged in to submit a review. Please sign in and try again.');
      } else if (error.response?.status === 403) {
        setError('You can only review properties you have stayed at.');
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message;
        if (message?.includes('already reviewed')) {
          setError('You have already reviewed this property.');
        } else if (message?.includes('Rating must be between')) {
          setError('Please select a rating between 1 and 5 stars.');
        } else if (message?.includes('Property ID, rating, and comment are required')) {
          setError('Please fill in all required fields.');
        } else {
          setError(message || 'Please check your input and try again.');
        }
      } else if (error.response?.status === 404) {
        setError('Property not found.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      if (!showSuccessAnimation) {
        setIsSubmitting(false);
      }
    }
  };

  const handleStarClick = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
    setError(null);
  };

  const handleImageAdd = (imageUrl: string) => {
    if (reviewForm.images.length < 5 && imageUrl.trim()) {
      // Basic URL validation
      try {
        new URL(imageUrl);
        setReviewForm(prev => ({
          ...prev,
          images: [...prev.images, imageUrl.trim()]
        }));
      } catch {
        setError('Please enter a valid image URL');
      }
    }
  };

  const handleImageRemove = (index: number) => {
    setReviewForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Get rating description
  const getRatingDescription = (rating: number) => {
    const descriptions = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return descriptions[rating as keyof typeof descriptions] || '';
  };

  // Character count color
  const getCharCountColor = () => {
    const length = reviewForm.comment.length;
    if (length > 2000) return 'text-red-500';
    if (length > 1800) return 'text-yellow-600';
    if (length < 10) return 'text-gray-400';
    return 'text-gray-500';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with fade animation */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
        onClick={!isSubmitting ? onClose : undefined}
      ></div>
      
      {/* Modal with success animation */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-modalSlideIn ${showSuccessAnimation ? 'animate-modalSuccess' : ''}`}>
        {/* Success Overlay */}
        {showSuccessAnimation && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-scaleIn">
              <i className="bi bi-check text-white text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
            <p className="text-gray-600">Thank you for sharing your experience</p>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[22px] font-semibold text-gray-900">Write a review</h3>
              <p className="text-sm text-gray-600 mt-1">Share your experience to help others</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              disabled={isSubmitting}
              aria-label="Close modal"
            >
              <i className="bi bi-x text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Error Message */}
          {error && (<AlertNotification type="error" message={error} onClose={() => setError(null)} position="top-right" size="sm"/>)}

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Rating Section */}
            <div className="bg-gray-50 rounded-xl p-5">
              <label className="block text-base font-medium text-gray-900 mb-3">
                How would you rate your stay?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-3xl transition-all duration-200 transform hover:scale-125 focus:outline-none focus:scale-125 p-1"
                    disabled={isSubmitting}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    <i className={`bi bi-star${star <= (hoveredRating || reviewForm.rating) ? '-fill' : ''} ${
                      star <= (hoveredRating || reviewForm.rating) 
                        ? 'text-yellow-400 drop-shadow-sm' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}></i>
                  </button>
                ))}
              </div>
              {(reviewForm.rating > 0 || hoveredRating > 0) && (
                <p className="text-center mt-3 text-sm font-medium text-gray-700 animate-fadeIn">
                  {getRatingDescription(hoveredRating || reviewForm.rating)} 
                  {' '}({hoveredRating || reviewForm.rating}/5)
                </p>
              )}
            </div>

            {/* Comment Section */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Tell us about your experience
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => {
                  setReviewForm(prev => ({ ...prev, comment: e.target.value }));
                  setError(null);
                }}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base resize-none"
                placeholder="What did you love about this place? How was the host? Any tips for future guests?"
                disabled={isSubmitting}
              ></textarea>
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs text-gray-500">
                  {reviewForm.comment.length < 10 && (
                    <span className="text-amber-600">
                      <i className="bi bi-info-circle mr-1"></i>
                      Minimum 10 characters required
                    </span>
                  )}
                </span>
                <span className={`text-xs font-medium ${getCharCountColor()}`}>
                  {reviewForm.comment.length}/2000
                </span>
              </div>
            </div>

            {/* Optional Images Section */}
            <div className="border-t pt-6">
              <label className="block text-base font-medium text-gray-900 mb-3">
                Add photos 
                <span className="text-sm font-normal text-gray-500 ml-2">(Optional, max 5)</span>
              </label>
              
              {/* Image Preview Grid */}
              {reviewForm.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {reviewForm.images.map((image, index) => (
                    <div key={index} className="relative group animate-fadeIn">
                      <img 
                        src={image} 
                        alt={`Review ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        disabled={isSubmitting}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <i className="bi bi-x text-sm"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Image Input */}
              {reviewForm.images.length < 5 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleImageAdd((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                      handleImageAdd(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-plus-lg mr-1"></i>
                    Add
                  </button>
                </div>
              )}
              
              {reviewForm.images.length === 5 && (
                <p className="text-sm text-amber-600 mt-2">
                  <i className="bi bi-info-circle mr-1"></i>
                  You've reached the maximum of 5 images
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || !reviewForm.rating || !reviewForm.comment.trim() || reviewForm.comment.length < 10
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-lg hover:shadow-xl'
                }`}
                disabled={isSubmitting || !reviewForm.rating || !reviewForm.comment.trim() || reviewForm.comment.length < 10}
              >
                {isSubmitting ? (
                  <>
                    <i className="bi bi-arrow-clockwise animate-spin"></i>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 text-center">
                <i className="bi bi-shield-check mr-2"></i>
                You can only review properties where you've completed a stay. All reviews are public and help future guests make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes modalSuccess {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-modalSuccess {
          animation: modalSuccess 0.5s ease-out;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AddReviewForm;