import { useState } from "react";

interface AddReviewFormProps {
  onClose: () => void;
  onAddReview?: (review: { id: number; name: string; date: string; rating: number; comment: string }) => void;
}

const AddReviewForm = ({ onClose, onAddReview }: AddReviewFormProps) => {

   const [reviewForm, setReviewForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        rating: 0,
        comment: ''
    });

    const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.firstName || !reviewForm.lastName || !reviewForm.email || !reviewForm.rating || !reviewForm.comment) {
      alert('Please fill in all fields');
      return;
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }

        // Here you would typically send the review to your API
        console.log('Review submitted:', reviewForm);
    alert('Thank you for your review! It has been submitted successfully.');
    onAddReview?.({
      id: Date.now(),
      name: `${reviewForm.firstName} ${reviewForm.lastName}`,
      date: new Date().toLocaleDateString(),
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });
    // Reset form and close modal
    setReviewForm({
      firstName: '',
      lastName: '',
      email: '',
      rating: 0,
      comment: ''
    });

    onClose();
  };

  const handleStarClick = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
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
                  >
                    <i className="bi bi-x-lg text-xl"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">Share your experience with future guests</p>
              </div>

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
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {reviewForm.comment.length}/500 characters
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#F20C8F] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
                  >
                    <i className="bi bi-send mr-2"></i>
                    Submit
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