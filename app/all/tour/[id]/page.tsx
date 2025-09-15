"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/app/api/apiService';
import AlertNotification from '@/app/components/notify';
import { decodeId, encodeId } from '@/app/utils/encoder';

interface TourPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface CreateTourBookingDto {
  tourId: number;
  scheduleId: string;
  numberOfParticipants: number;
  participants: Participant[];
  totalAmount: number;
  specialRequests?: string;
}

interface Participant {
  name: string;
  email: string;
  phone: string;
  age: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    tourId: number;
    scheduleId: string;
    numberOfParticipants: number;
    totalAmount: number;
    status: string;
    createdAt: string;
  };
  errors?: string[];
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
}

interface TourGuide {
  firstName: string;
  lastName: string;
  totalTours: number;
  rating: number;
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

// Fixed TypeScript interfaces for component props
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: any) => void;
  loading: boolean;
}

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images?: any;
}

// Transform backend tour data to frontend format
const transformTourData = (backendTour: any) => {
  const parseJSON = (jsonString: string, fallback: any) => {
    try {
      return JSON.parse(jsonString || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  };

  const itinerary = parseJSON(backendTour.itinerary, []);
  const images = parseJSON(backendTour.images, {"main":[],"gallery":[]});

  return {
    id: backendTour.id,
    title: backendTour.title,
    shortDescription: backendTour.shortDescription,
    description: backendTour.description,
    price: backendTour.price,
    duration: backendTour.duration,
    difficulty: backendTour.difficulty,
    minGroupSize: backendTour.minGroupSize,
    maxGroupSize: backendTour.maxGroupSize,
    locationCity: backendTour.locationCity,
    locationCountry: backendTour.locationCountry,
    locationState: backendTour.locationState,
    locationAddress: backendTour.locationAddress,
    meetingPoint: backendTour.meetingPoint,
    rating: backendTour.rating,
    totalReviews: backendTour.totalReviews,
    inclusions: backendTour.inclusions || [],
    exclusions: backendTour.exclusions || [],
    requirements: backendTour.requirements || [],
    schedules: backendTour.schedules || [],
    tourGuide: backendTour.tourGuide,
    itinerary,
    images
  };
};

// Review Modal Component - Fixed props typing
const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [reviewData, setReviewData] = useState({
    bookingId: '',
    rating: 5,
    comment: '',
    title: ''
  });

  const handleSubmit = () => {
    if (!reviewData.comment.trim()) return;
    onSubmit(reviewData);
    setReviewData({ bookingId: '', rating: 5, comment: '', title: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-[#083A85]">Write a Review</h3>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Booking ID</label>
            <input
              type="text"
              value={reviewData.bookingId}
              onChange={(e) => setReviewData({...reviewData, bookingId: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent"
              placeholder="Your booking ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setReviewData({...reviewData, rating: star})}
                  className="text-3xl focus:outline-none transition-colors"
                >
                  <span className={star <= reviewData.rating ? 'text-[#F20C8F]' : 'text-gray-300'}>★</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title</label>
            <input
              type="text"
              value={reviewData.title}
              onChange={(e) => setReviewData({...reviewData, title: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent"
              placeholder="Give your review a title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent"
              rows={4}
              placeholder="Share your experience..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !reviewData.comment.trim()}
              className="px-6 py-3 bg-[#F20C8F] text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Photo Gallery Modal Component - Fixed props typing
const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ isOpen, onClose, images = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">All Photos</h3>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-2xl transition-colors"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({length: 8}).map((_, idx) => (
              <div key={idx} className="bg-gray-200 rounded-xl aspect-square flex items-center justify-center shadow-sm">
                <span className="text-gray-500 font-medium">Photo {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TourDetailPage({ params }: TourPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  // Core state
  const [tour, setTour] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Booking state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  // UI state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Form state
  const [bookingForm, setBookingForm] = useState({
    tourId: '',
    scheduleId: '',
    numberOfParticipants: 1,
    participants: [{ name: '', email: '', phone: '', age: '' }] as Participant[],
    totalAmount: 0,
    specialRequests: ''
  });

  // Alert state
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'info'
  });

  // ID validation
  const [validTourId, setValidTourId] = useState<number | null>(null);
  const [invalidId, setInvalidId] = useState(false);

  // ID validation useEffect - updated to handle loading state properly
  useEffect(() => {
    if (!resolvedParams.id) {
      setError('No tour ID provided');
      setInvalidId(true);
      setLoading(false);
      return;
    }

    const decodedId: any = decodeId(resolvedParams.id);
    if (decodedId === null || decodedId === undefined) {
      setError('Unable to decode tour ID');
      setInvalidId(true);
      setLoading(false);
      return;
    }

    setValidTourId(decodedId);
  }, [resolvedParams.id]);

  // Alert functions
  const showAlert = (message: string, type: AlertState['type'], duration = 5000) => {
    setAlert({ show: true, message, type, duration });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Fetch tour data
  useEffect(() => {
    const fetchTourData = async () => {
      if (validTourId === null) return;
      
      try {
        setLoading(true);
        setError(null);

        const response: any = await api.get(`/tours/${validTourId}`);

        if (response.success) {
          const transformedTour = transformTourData(response.data.data);
          setTour(transformedTour);
          
          setBookingForm(prev => ({
            ...prev,
            tourId: transformedTour.id,
            totalAmount: transformedTour.price
          }));

          showAlert('Tour loaded successfully', 'success', 3000);
        } else {
          throw new Error(response.message || 'Failed to fetch tour');
        }
      } catch (err: any) {
        console.error('Failed to fetch tour:', err);
        setError(err?.message || 'Failed to load tour');
        showAlert(`Error loading tour: ${err || 'Unknown error'}`, 'error');
        
        // Fallback data
        setTour({
          id: 0,
          title: 'Tour Not Found',
          shortDescription: 'Tour could not be loaded',
          description: 'This tour data could not be loaded from the server.',
          price: 0,
          duration: 0,
          difficulty: 'Unknown',
          minGroupSize: 0,
          maxGroupSize: 0,
          locationCity: 'Unknown',
          locationCountry: 'Unknown',
          rating: 0,
          totalReviews: 0,
          inclusions: [],
          exclusions: [],
          requirements: [],
          schedules: [],
          tourGuide: null,
          itinerary: [],
          images: {"main":[],"gallery":[]}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [validTourId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (validTourId === null) return;
      
      try {
        setReviewsLoading(true);
        const response: any = await api.get(`/tours/${validTourId}/reviews`);
        
        if (response.success) {
          const transformedReviews = (response.data.reviews || []).map((review: any) => ({
            id: review.id,
            userName: review.userName || review.name || 'Anonymous',
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
          }));
          setReviews(transformedReviews);
        }
      } catch (err: any) {
        console.error('Failed to fetch reviews:', err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [validTourId]);

  // Fixed booking validation - more comprehensive check
  const validateBooking = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!selectedSchedule) errors.push('Please select a schedule');
    if (!bookingForm.numberOfParticipants || bookingForm.numberOfParticipants < 1) {
      errors.push('At least 1 participant is required');
    }
    if (tour && bookingForm.numberOfParticipants > tour.maxGroupSize) {
      errors.push(`Maximum ${tour.maxGroupSize} participants allowed`);
    }
    if (tour && bookingForm.numberOfParticipants < tour.minGroupSize) {
      errors.push(`Minimum ${tour.minGroupSize} participants required`);
    }

    bookingForm.participants.forEach((participant, index) => {
      if (!participant.name.trim()) errors.push(`Participant ${index + 1}: Name is required`);
      if (!participant.email.trim()) errors.push(`Participant ${index + 1}: Email is required`);
      if (!participant.phone.trim()) errors.push(`Participant ${index + 1}: Phone is required`);
      if (!participant.age.trim()) errors.push(`Participant ${index + 1}: Age is required`);
    });

    if (!validTourId) errors.push('Invalid tour ID');

    return { isValid: errors.length === 0, errors };
  };

  // Check if all required fields are filled (for enabling/disabling the button)
  const isBookingFormComplete = (): boolean => {
    if (!selectedSchedule) return false;
    
    return bookingForm.participants.every(participant => 
      participant.name.trim() && 
      participant.email.trim() && 
      participant.phone.trim() && 
      participant.age.trim()
    );
  };

  // Handle booking submission
  const handleBookingSubmit = async () => {
    const validation = validateBooking();
    if (!validation.isValid) {
      const errorMessage = validation.errors.join('. ');
      setBookingError(errorMessage);
      showAlert(`Validation failed: ${errorMessage}`, 'error');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(false);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        const loginMessage = 'Please log in to make a booking';
        setBookingError(loginMessage);
        showAlert(loginMessage, 'warning');
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const bookingData: CreateTourBookingDto = {
        tourId: validTourId!,
        scheduleId: selectedSchedule!.id,
        numberOfParticipants: bookingForm.numberOfParticipants,
        participants: bookingForm.participants,
        totalAmount: bookingForm.numberOfParticipants * tour.price,
        specialRequests: bookingForm.specialRequests || ''
      };

      api.setAuth(token);
      const response = await api.post('/tours/bookings', bookingData);
      const result: BookingResponse = response.data;

      if (result.success && result.data) {
        setBookingSuccess(true);
        setCreatedBooking(result.data);
        showAlert('Booking created successfully!', 'success', 3000);
        
        const encodedBookingId = encodeId(result.data.id);
        setTimeout(() => {
          router.push(`/tours/${resolvedParams.id}/confirm?bookingId=${encodedBookingId}`);
        }, 2000);
      } else {
        const errorMessage = result.message || 'Something went wrong. Please try again.';
        setBookingError(errorMessage);
        showAlert(`Booking failed: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      console.error('Booking creation error:', error);
      let userMessage = 'Unable to process your booking. Please try again.';
      
      if (error.response?.status === 401) {
        userMessage = 'Please log in to make a booking';
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if (error.response?.status === 409) {
        userMessage = 'This schedule is no longer available.';
      }
      
      setBookingError(userMessage);
      showAlert(userMessage, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (reviewData: any) => {
    try {
      setLoading(true);
      const response: any = await api.post(`/tours/${validTourId}/reviews`, reviewData);
      
      if (response.success) {
        showAlert('Review submitted successfully!', 'success');
        setShowReviewModal(false);
        
        const newReview = {
          id: Date.now(),
          userName: 'You',
          rating: reviewData.rating,
          comment: reviewData.comment,
          createdAt: new Date().toISOString()
        };
        setReviews(prev => [newReview, ...prev]);
      }
    } catch (error: any) {
      console.error('Error creating review:', error);
      showAlert('Failed to submit review. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update participants
  const updateParticipants = (count: number) => {
    const participants = Array(count).fill(null).map((_, index) => 
      bookingForm.participants[index] || { name: '', email: '', phone: '', age: '' }
    );
    setBookingForm({
      ...bookingForm,
      numberOfParticipants: count,
      participants,
      totalAmount: count * (tour?.price || 0)
    });
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updatedParticipants = [...bookingForm.participants];
    updatedParticipants[index] = { ...updatedParticipants[index], [field]: value };
    setBookingForm({ ...bookingForm, participants: updatedParticipants });
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'challenging': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getReviewStats = () => {
    const total = reviews.length;
    if (total === 0) return { average: '0.0', total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }};
    
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = (totalRating / total).toFixed(1);
    
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      counts[review.rating as keyof typeof counts]++;
    });

    return { average, total, counts };
  };

  const reviewStats = getReviewStats();

  // Error/Loading states
  if (invalidId) {
    return (
      <div className="mt-14 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-red-600 text-xl font-bold mb-4">Invalid Tour ID</div>
              <p className="text-red-500 mb-6">The tour ID is invalid or corrupted.</p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/tours')}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Browse Tours
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !tour) {
    return (
      <div className="mt-14 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded-lg w-3/4"></div>
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-24"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded-xl"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
              <div className="h-96 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{tour?.title}</title>
      </head>
      
      {/* Alert Notification */}
      {alert.show && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          position="top-center"
          duration={alert.duration}
          onClose={hideAlert}
          showProgress={true}
          autoHide={true}
        />
      )}
      
      <div className="mt-14 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Error Banner */}
          {error && tour && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="text-yellow-800">
                <p className="text-sm font-medium">Some tour data could not be loaded. Showing limited information.</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {bookingSuccess && createdBooking && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <div className="text-green-800">
                <p className="font-bold">Booking Created Successfully!</p>
                <p className="text-sm">Booking ID: {createdBooking.id} | Status: {createdBooking.status}</p>
                <p className="text-sm">Redirecting to confirmation...</p>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#083A85] mb-4 leading-tight">
              {tour?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-700">
              <span className="flex items-center gap-2 font-semibold">
                <span className="text-[#F20C8F] text-xl">★</span>
                <span>{tour?.rating || 'No rating'}</span>
                <span className="text-gray-500">({tour?.totalReviews || 0} reviews)</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-2">
                <span className="text-[#F20C8F]">📍</span>
                <span>{tour?.locationCity}, {tour?.locationCountry}</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tour?.difficulty)}`}>
                {tour?.difficulty}
              </span>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="mb-10">
            <div className="grid grid-cols-4 gap-3 h-[300px] sm:h-[500px] rounded-xl overflow-hidden relative">
              <div 
                className="col-span-4 sm:col-span-2 sm:row-span-2 relative group cursor-pointer bg-gray-200 flex items-center justify-center"
                onClick={() => setShowPhotoGallery(true)}
              >
                <span className="text-gray-500 text-lg">📸 Main Tour Image</span>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              {Array.from({length: 4}).map((_, idx) => (
                <div 
                  key={idx} 
                  className="hidden sm:block relative group cursor-pointer bg-gray-200 flex items-center justify-center"
                  onClick={() => setShowPhotoGallery(true)}
                >
                  <span className="text-gray-400 text-sm">Image {idx + 2}</span>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
              ))}
              <button 
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold text-gray-800"
                onClick={() => setShowPhotoGallery(true)}
              >
                Show all photos
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Host Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-[#083A85] mb-2">
                    {tour?.tourGuide ? 
                      `Experience hosted by ${tour.tourGuide.firstName} ${tour.tourGuide.lastName}` :
                      'Experience hosted by a Certified Guide'
                    }
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-700">
                    <span>{Math.floor((tour?.duration || 0) / 24)} days</span>
                    <span className="text-gray-300">•</span>
                    <span>Up to {tour?.maxGroupSize} guests</span>
                    <span className="text-gray-300">•</span>
                    <span>{tour?.difficulty} difficulty</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#083A85] to-[#F20C8F] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {tour?.tourGuide ? 
                    (tour.tourGuide.firstName[0] + tour.tourGuide.lastName[0]) : 'G'
                  }
                </div>
              </div>

              {/* Mobile Booking Card */}
              <div className="block lg:hidden">
                <div className="border-2 border-[#083A85] rounded-xl p-6 shadow-xl bg-gradient-to-br from-white to-blue-50">
                  <div className="flex justify-between items-baseline mb-6">
                    <div>
                      <span className="text-4xl font-bold text-[#F20C8F]">${tour?.price}</span>
                      <span className="text-gray-600 text-lg"> / person</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-[#F20C8F]">★</span>
                        <span className="font-bold">{tour?.rating || 'No rating'}</span>
                      </div>
                      <span className="text-sm text-gray-600">({reviewStats.total} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">PARTICIPANTS</label>
                      <select
                        value={bookingForm.numberOfParticipants}
                        onChange={(e) => updateParticipants(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"
                      >
                        {Array.from({ length: (tour?.maxGroupSize || 1) - (tour?.minGroupSize || 1) + 1 }, (_, i) => (
                          <option key={i} value={(tour?.minGroupSize || 1) + i}>
                            {(tour?.minGroupSize || 1)} participants
                          </option>
                        ))}
                      </select>
                    </div>

                    {bookingError && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                        <p className="text-red-600 text-sm font-medium">{bookingError}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowBookingModal(true)}
                      disabled={!selectedSchedule}
                      className="w-full py-4 bg-[#F20C8F] text-white rounded-lg font-bold text-lg hover:bg-opacity-90 shadow-lg transition-all transform hover:scale-[1.02]"
                    >
                      Book Now
                    </button>

                    {/*<p className="text-center text-sm text-gray-500">You won't be charged yet</p>*/}
                    
                    <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>${tour?.price} × {bookingForm.numberOfParticipants} participants</span>
                        <span className="font-semibold">${bookingForm.totalAmount}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span className="text-[#F20C8F]">${bookingForm.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-2xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Free Cancellation</h3>
                    <p className="text-gray-600 text-sm">Cancel up to 24 hours in advance for a full refund.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Reserve & Pay Later</h3>
                    <p className="text-gray-600 text-sm">Keep your travel plans flexible — book your spot and pay nothing today.</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="py-6 border-b">
                <h2 className="text-2xl font-bold text-[#083A85] mb-4">About This Experience</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{tour?.description}</p>
              </div>

              {/* Itinerary */}
              {tour?.itinerary && tour.itinerary.length > 0 && (
                <div className="py-6 border-b">
                  <h2 className="text-2xl font-bold text-[#083A85] mb-6">Day-by-Day Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((item: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-8 h-8 bg-[#F20C8F] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                          <p className="text-gray-700 mb-2">{item.description}</p>
                          <span className="text-sm text-[#F20C8F] font-medium">Duration: {item.duration} hours</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Inclusions & Exclusions */}
              <div className="py-6 border-b">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-[#083A85] mb-4 flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      What's Included
                    </h3>
                    <div className="space-y-3">
                      {(tour?.inclusions || []).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-green-500 text-lg mt-1">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-[#083A85] mb-4 flex items-center gap-2">
                      <span className="text-red-500">✗</span>
                      Not Included
                    </h3>
                    <div className="space-y-3">
                      {(tour?.exclusions || []).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-red-500 text-lg mt-1">✗</span>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {tour?.requirements && tour.requirements.length > 0 && (
                <div className="py-6 border-b">
                  <h3 className="text-xl font-bold text-[#083A85] mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    Important Requirements
                  </h3>
                  <div className="space-y-3">
                    {tour.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-yellow-500 text-lg mt-1">•</span>
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="py-6 border-b">
                <h2 className="text-2xl font-bold text-[#083A85] mb-4">Meeting Point & Location</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-[#F20C8F] text-xl mt-1">📍</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">{tour?.meetingPoint}</h4>
                      <div className="text-gray-600 space-y-1">
                        <p>{tour?.locationAddress}</p>
                        <p>{tour?.locationCity}, {tour?.locationState}</p>
                        <p>{tour?.locationCountry}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#083A85]">Guest Reviews</h2>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="px-6 py-3 border-2 border-[#083A85] text-[#083A85] rounded-lg font-bold hover:bg-[#083A85] hover:text-white transition-all"
                  >
                    Write Review
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[#F20C8F] text-4xl">★</span>
                    <div>
                      <span className="text-3xl font-bold">{reviewStats.average}</span>
                      <p className="text-gray-600">({reviewStats.total} reviews)</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-4">{rating}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-[#F20C8F] h-3 rounded-full transition-all" 
                            style={{ width: `${reviewStats.total > 0 ? (reviewStats.counts[rating as keyof typeof reviewStats.counts] / reviewStats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {reviewStats.counts[rating as keyof typeof reviewStats.counts]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-[#F20C8F] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#083A85] to-[#F20C8F] rounded-full flex items-center justify-center text-white font-bold">
                            {review.userName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-[#083A85]">{review.userName}</h4>
                                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-lg ${i < review.rating ? 'text-[#F20C8F]' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                    
                    {reviews.length > 3 && (
                      <button 
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="w-full py-3 border-2 border-[#083A85] text-[#083A85] rounded-lg font-bold hover:bg-[#083A85] hover:text-white transition-all"
                      >
                        {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Desktop Booking */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="border-2 border-[#083A85] rounded-xl p-6 shadow-2xl bg-gradient-to-br from-white to-blue-50">
                  <div className="flex justify-between items-baseline mb-6">
                    <div>
                      <span className="text-4xl font-bold text-[#F20C8F]">${tour?.price}</span>
                      <span className="text-gray-600 text-lg"> / person</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-[#F20C8F]">★</span>
                        <span className="font-bold">{tour?.rating || 'No rating'}</span>
                      </div>
                      <span className="text-sm text-gray-600">({reviewStats.total} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">PARTICIPANTS</label>
                      <select
                        value={bookingForm.numberOfParticipants}
                        onChange={(e) => updateParticipants(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"
                      >
                        {Array.from({ length: (tour?.maxGroupSize || 1) - (tour?.minGroupSize || 1) + 1 }, (_, i) => (
                          <option key={i} value={(tour?.minGroupSize || 1) + i}>
                            {(tour?.minGroupSize || 1) + i} participants
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tour Guide Info */}
                    {tour?.tourGuide && (
                      <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-bold text-gray-900 mb-3">Your Guide</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#083A85] to-[#F20C8F] rounded-full flex items-center justify-center text-white font-bold">
                            {tour.tourGuide.firstName[0]}{tour.tourGuide.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {tour.tourGuide.firstName} {tour.tourGuide.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{tour.tourGuide.totalTours} tours completed</p>
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1 text-sm text-gray-600">{tour.tourGuide.rating || 'No rating'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Available Schedules */}
                    {tour?.schedules && tour.schedules.length > 0 && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">AVAILABLE DATES {"(click to select)"}</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {tour.schedules.map((schedule: Schedule) => (
                            <div 
                              key={schedule.id}
                              className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                selectedSchedule?.id === schedule.id 
                                  ? 'border-[#F20C8F] bg-pink-50' 
                                  : 'border-gray-200 hover:border-[#083A85]'
                              }`}
                              onClick={() => setSelectedSchedule(schedule)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {formatDate(schedule.startDate)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {schedule.startTime} - {schedule.endTime}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-[#F20C8F]">
                                    {schedule.availableSlots} slots
                                  </p>
                                  <p className="text-xs text-gray-500">available</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {bookingError && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                        <p className="text-red-600 text-sm font-medium">{bookingError}</p>
                      </div>
                    )}

                    
                    <button
                      onClick={() => setShowBookingModal(true)}
                      disabled={!selectedSchedule}
                      className={`w-full py-4 ${!selectedSchedule ? 'cursor-nodrop bg-[#F20C8F]/50 ' : ' bg-[#F20C8F]'} text-white rounded-lg font-bold text-lg hover:bg-opacity-90 shadow-lg transition-all transform hover:scale-[1.02]`}
                    >
                      Book Now
                    </button>
                    
                    
                    {/*<p className="text-center text-sm text-gray-500">You won't be charged yet</p>*/}

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>${tour?.price} × {bookingForm.numberOfParticipants} participants</span>
                        <span className="font-semibold">${bookingForm.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Service Fee</span>
                        <span>$0</span>
                      </div>
                      <div className="flex justify-between font-bold text-xl border-t pt-3">
                        <span>Total</span>
                        <span className="text-[#F20C8F]">${bookingForm.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#083A85]">Complete Your Booking</h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-light"
                  >
                    x
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl border-l-4 border-[#F20C8F]">
                  <h4 className="font-bold text-[#083A85] text-lg">{tour?.title}</h4>
                  <p className="text-gray-700">
                    {selectedSchedule ? formatDate(selectedSchedule.startDate) : 'Please select a date above'}
                  </p>
                  <p className="text-lg font-semibold text-[#F20C8F]">
                    ${tour?.price} × {bookingForm.numberOfParticipants} = ${bookingForm.totalAmount}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Number of Participants</label>
                    <select
                      value={bookingForm.numberOfParticipants}
                      onChange={(e) => updateParticipants(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] text-lg"
                    >
                      {Array.from({ length: (tour?.maxGroupSize || 1) - (tour?.minGroupSize || 1) + 1 }, (_, i) => (
                        <option key={i} value={(tour?.minGroupSize || 1) + i}>
                          {(tour?.minGroupSize || 1) + i} participants
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Participant Details */}
                  {bookingForm.participants.map((participant, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                      <h5 className="font-bold text-gray-900 mb-4 text-lg">Participant {index + 1}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={participant.email}
                          onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={participant.phone}
                          onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          value={participant.age}
                          onChange={(e) => updateParticipant(index, 'age', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Special Requests (Optional)</label>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F]"
                      rows={4}
                      placeholder="Any dietary requirements, accessibility needs, or special requests..."
                    />
                  </div>

                  {bookingError && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                      <p className="text-red-600 font-medium">{bookingError}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBookingSubmit}
                      disabled={bookingLoading || !isBookingFormComplete()}
                      className="flex-1 py-3 bg-[#F20C8F] text-white rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all"
                    >
                      {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          loading={loading}
        />

        <PhotoGalleryModal
          isOpen={showPhotoGallery}
          onClose={() => setShowPhotoGallery(false)}
          images={tour?.images}
        />
      </div>
    </>
  );
}