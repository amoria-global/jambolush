import { useState } from "react";
import api from "../../api/apiService"; 

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
      // Call the backend API with propertyId in the request body
      const response = await api.addPropertyReview({
        propertyId: propertyId,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        images: reviewForm.images.length > 0 ? reviewForm.images : undefined
      });

      if (response.data.success) {
        // Success - call the callback with the new review data
        const newReview = response.data.data;
        onAddReview?.({
          id: newReview.id,
          name: newReview.userName,
          date: 'Just now',
          rating: newReview.rating,
          comment: newReview.comment,
          propertyId: propertyId
        });

        // Show success message
        alert('Thank you for your review! It has been submitted successfully.');

        // Reset form and close modal
        setReviewForm({
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
      
      {/* Modal: Main container now uses flex-col and no longer scrolls */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header: No longer sticky, acts as a flex item */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#083A85]">Add Your Review</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              disabled={isSubmitting}
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>
          </div>
          <p className="text-base text-gray-600 mt-1">Share your experience with future guests</p>
        </div>

        {/* Scrollable Content Area: This new div handles the overflow */}
        <div className="overflow-y-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-base text-red-600">{error}</p>
            </div>
          )}

        {/* Form Content */}
        <div className="p-6 space-y-5">
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
              disabled={isSubmitting}
            ></textarea>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum 10 characters</span>
              <span className={reviewForm.comment.length > 2000 ? 'text-red-500' : ''}>
                {reviewForm.comment.length}/2000 characters
              </span>
            </div>
          </div>

          {/* Optional Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="space-y-2">
              {reviewForm.images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <img src={image} alt={`Review ${index + 1}`} className="w-10 h-10 object-cover rounded" />
                  <span className="text-sm text-gray-600 flex-1 truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-trash text-sm"></i>
                  </button>
                </div>
              ))}
              {reviewForm.images.length < 5 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                    disabled={isSubmitting}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Maximum 5 images. Press Enter or click Add to include an image.</p>
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
              type="button"
              onClick={handleReviewSubmit}
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
                  Submit Review
                </>
              )}
            </button>
          </div>

          {/* Requirements Notice */}
          <div className="bg-blue-50 rounded-lg p-3 mt-4">
            <p className="text-xs text-blue-700 text-center">
              <i className="bi bi-info-circle mr-1"></i>
              You can only review properties where you have completed a stay. Reviews are public and visible to all users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewForm;