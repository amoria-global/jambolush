import { useState } from "react";
import api from "../../api/apiService"; 

interface AddReviewFormProps {
  propertyId: number; // Add propertyId prop
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
    firstName: '',
    lastName: '',
    email: '',
    rating: 0,
    comment: '',
    images: [] as string[] // Add images array
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.firstName || !reviewForm.lastName || !reviewForm.email || !reviewForm.rating || !reviewForm.comment) {
      setError('Please fill in all required fields');
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

    if (reviewForm.comment.trim().length > 1000) {
      setError('Comment cannot exceed 1000 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call the backend API
      const response = await api.addPropertyReview(propertyId, {
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        images: reviewForm.images.length > 0 ? reviewForm.images : undefined
      });

      if (response.data.success) {
        // Success - call the callback with the new review data
        onAddReview?.({
          id: Date.now(), // Temporary ID
          name: `${reviewForm.firstName} ${reviewForm.lastName}`,
          date: 'Just now',
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
          propertyId: propertyId
        });

        // Show success message
        alert('Thank you for your review! It has been submitted successfully.');

        // Reset form and close modal
        setReviewForm({
          firstName: '',
          lastName: '',
          email: '',
          rating: 0,
          comment: '',
          images: []
        });

        onClose();
      } else {
        setError(response.data.message || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        setError('You must be logged in to submit a review');
      } else if (error.response?.status === 403) {
        setError('You can only review properties you have stayed at');
      } else if (error.response?.status === 404) {
        setError('Property not found');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const handleImageAdd = (imageUrl: string) => {
    if (reviewForm.images.length < 5 && imageUrl.trim()) {
      setReviewForm(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setReviewForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#083A85]">Add Your Review</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              disabled={isSubmitting}
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Share your experience with future guests</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={reviewForm.firstName}
                onChange={(e) => setReviewForm(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-sm"
                placeholder="John"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={reviewForm.lastName}
                onChange={(e) => setReviewForm(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-sm"
                placeholder="Doe"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={reviewForm.email}
              onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-sm"
              placeholder="john.doe@example.com"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">We'll never share your email address</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-2xl transition-all duration-200 hover:scale-110 focus:outline-none focus:scale-110"
                  disabled={isSubmitting}
                >
                  <i className={`bi bi-star${star <= reviewForm.rating ? '-fill' : ''} ${
                    star <= reviewForm.rating ? 'text-[#F20C8F]' : 'text-gray-300 hover:text-[#F20C8F]'
                  }`}></i>
                </button>
              ))}
              {reviewForm.rating > 0 && (
                <span className="ml-3 text-sm font-medium text-gray-600">
                  {reviewForm.rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-sm resize-none"
              placeholder="Tell us about your experience staying at this property. What did you love? Any suggestions for improvement?"
              required
              disabled={isSubmitting}
            ></textarea>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum 10 characters</span>
              <span className={reviewForm.comment.length > 1000 ? 'text-red-500' : ''}>
                {reviewForm.comment.length}/1000 characters
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#F20C8F] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="bi bi-hourglass-split mr-2 animate-spin"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-send mr-2"></i>
                  Submit
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <p className="text-xs text-gray-600 text-center">
              <i className="bi bi-info-circle mr-1"></i>
              Reviews are public and will be visible to all users after moderation
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewForm;