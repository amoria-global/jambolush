"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/apiService';
import AlertNotification from '@/app/components/notify';
import { decodeId, encodeId } from '@/app/utils/encoder';
import { calculateDisplayPrice, calculateBookingTotal, calculatePriceBreakdown } from '@/app/utils/pricing';

interface TourPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface CreateTourBookingDto {
  tourId: number;
  scheduleId: string;
  numberOfParticipants: number;
  participants: TourParticipant[];
  totalAmount: number;
  specialRequests?: string;
}

interface TourParticipant {
  name: string;
  age: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  specialRequirements?: string[];
  medicalConditions?: string[];
}

interface ParticipantForm {
  name: string;
  age: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  specialRequirements: string;
  medicalConditions: string;
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
  profileImage?: string;
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: any) => void;
  loading: boolean;
}

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images?: string[];
}

// Transform backend tour data
const transformTourData = (backendTour: any) => {
  const parseJSON = (jsonString: string, fallback: any) => {
    try {
      return JSON.parse(jsonString || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  };

  const itinerary = parseJSON(backendTour.itinerary, []);
  const displayPrice = calculateDisplayPrice(backendTour.price);

  return {
    id: backendTour.id,
    title: backendTour.title,
    shortDescription: backendTour.shortDescription,
    description: backendTour.description,
    price: displayPrice,
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
    images: backendTour.images || { main: [], gallery: [] },
  };
};

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Write a review</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <span className="text-xl">×</span>
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Booking ID</label>
            <input
              type="text"
              value={reviewData.bookingId}
              onChange={(e) => setReviewData({...reviewData, bookingId: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Enter your booking ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setReviewData({...reviewData, rating: star})}
                  className="text-3xl focus:outline-none transition-colors"
                >
                  <i className={`bi bi-star-fill ${star <= reviewData.rating ? 'text-black' : 'text-gray-300'}`}></i>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Review title</label>
            <input
              type="text"
              value={reviewData.title}
              onChange={(e) => setReviewData({...reviewData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Sum up your experience"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Your review</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              rows={5}
              placeholder="Share details of your experience"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !reviewData.comment.trim()}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ isOpen, onClose, images = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="sticky top-0 bg-white border-b p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 hover:text-gray-600 transition"
          >
            <i className="bi bi-chevron-left text-lg"></i>
            <span className="font-medium">Back</span>
          </button>
          <h3 className="text-lg font-medium">Tour photos</h3>
          <div className="w-20"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.length > 0 ? images.map((imgUrl, idx) => (
              <div key={idx} className="bg-gray-100 rounded-xl aspect-[4/3] overflow-hidden">
                <img src={imgUrl} alt={`Tour photo ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            )) : (
              <p className="md:col-span-2 text-center text-gray-500 py-10">No photos available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function TourDetailPage({ params }: TourPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const [tour, setTour] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    tourId: '',
    scheduleId: '',
    numberOfParticipants: 1,
    participants: [{
      name: '',
      age: '',
      email: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      specialRequirements: '',
      medicalConditions: ''
    }] as ParticipantForm[],
    totalAmount: 0,
    specialRequests: ''
  });

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'info'
  });

  const [validTourId, setValidTourId] = useState<number | null>(null);
  const [invalidId, setInvalidId] = useState(false);

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

  const showAlert = (message: string, type: AlertState['type'], duration = 5000) => {
    setAlert({ show: true, message, type, duration });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    const fetchTourData = async () => {
      if (validTourId === null) return;
      
      try {
        setLoading(true);
        setError(null);

        const response: any = await api.get(`/tours/${validTourId}`);

        if (response.data.success) {
          const transformedTour = transformTourData(response.data.data);
          setTour(transformedTour);
          
          setBookingForm(prev => ({
            ...prev,
            tourId: transformedTour.id,
            totalAmount: transformedTour.price
          }));
        } else {
          throw new Error(response.message || 'Failed to fetch tour');
        }
      } catch (err: any) {
        console.error('Failed to fetch tour:', err);
        setError(err?.message || 'Failed to load tour');
        showAlert(`Error loading tour: ${err?.message || 'Unknown error'}`, 'error');
        
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
          images: {main:[], gallery:[]}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [validTourId]);

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

  // Calculate total with display price and 4% tax
  const calculateTourTotal = () => {
    if (tour && bookingForm.numberOfParticipants > 0) {
      return calculateBookingTotal(tour.price, bookingForm.numberOfParticipants, false, true);
    }
    return 0;
  };

  // Get price breakdown showing display price + 4% tax
  const getTourPriceBreakdown = () => {
    if (tour && bookingForm.numberOfParticipants > 0) {
      return calculatePriceBreakdown(tour.price, bookingForm.numberOfParticipants, false, true);
    }
    return null;
  };

  const transformParticipantsForBackend = (formParticipants: ParticipantForm[]): TourParticipant[] => {
    return formParticipants.map(participant => ({
      name: participant.name,
      age: parseInt(participant.age) || 0,
      emergencyContact: {
        name: participant.emergencyContactName,
        phone: participant.emergencyContactPhone,
        relationship: participant.emergencyContactRelationship
      },
      specialRequirements: participant.specialRequirements ? [participant.specialRequirements] : [],
      medicalConditions: participant.medicalConditions ? [participant.medicalConditions] : []
    }));
  };

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
      if (!participant.age.trim()) errors.push(`Participant ${index + 1}: Age is required`);
      if (!participant.emergencyContactName.trim()) errors.push(`Participant ${index + 1}: Emergency contact name is required`);
      if (!participant.emergencyContactPhone.trim()) errors.push(`Participant ${index + 1}: Emergency contact phone is required`);
      if (!participant.emergencyContactRelationship.trim()) errors.push(`Participant ${index + 1}: Emergency contact relationship is required`);
    });

    if (!validTourId) errors.push('Invalid tour ID');

    return { isValid: errors.length === 0, errors };
  };

  const isBookingFormComplete = (): boolean => {
    if (!selectedSchedule) return false;
    
    return bookingForm.participants.every(participant => 
      participant.name.trim() && 
      participant.age.trim() && 
      participant.emergencyContactName.trim() &&
      participant.emergencyContactPhone.trim() &&
      participant.emergencyContactRelationship.trim()
    );
  };

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
        router.push(`/all/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const totalAmount = calculateTourTotal();

      const bookingData: CreateTourBookingDto = {
        tourId: validTourId!,
        scheduleId: selectedSchedule!.id,
        numberOfParticipants: bookingForm.numberOfParticipants,
        participants: transformParticipantsForBackend(bookingForm.participants),
        totalAmount: totalAmount,
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
          router.push(`/tours/${resolvedParams.id}/confirm-and-pay?bookingId=${encodedBookingId}`);
        }, 2000);
      } else {
        const errorMessage = result.message || 'Something went wrong. Please try again.';
        setBookingError(errorMessage);
        showAlert(`Booking failed: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      console.error('Booking creation error:', error);
      let userMessage = error.response?.data?.message || 'Unable to process your booking. Please try again.';
      
      if (error.response?.status === 401) {
        userMessage = 'Please log in to make a booking';
        router.push(`/all/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if (error.response?.status === 409) {
        userMessage = 'This schedule is no longer available.';
      }
      
      setBookingError(userMessage);
      showAlert(userMessage, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      setLoading(true);
      const response: any = await api.post(`/tours/reviews`, reviewData);
      
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
      showAlert(error.data.message ||  'Failed to submit review. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createEmptyParticipant = (): ParticipantForm => ({
    name: '',
    age: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    specialRequirements: '',
    medicalConditions: ''
  });

  const updateParticipants = (count: number) => {
    const participants = Array(count).fill(null).map((_, index) => 
      bookingForm.participants[index] || createEmptyParticipant()
    );
    setBookingForm({
      ...bookingForm,
      numberOfParticipants: count,
      participants,
      totalAmount: count * (tour?.price || 0)
    });
  };

  const updateParticipant = (index: number, field: keyof ParticipantForm, value: string) => {
    const updatedParticipants = [...bookingForm.participants];
    updatedParticipants[index] = { ...updatedParticipants[index], [field]: value };
    setBookingForm({ ...bookingForm, participants: updatedParticipants });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      challenging: 'bg-red-100 text-red-800'
    };
    return colors[difficulty?.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
  const priceBreakdown = getTourPriceBreakdown();
  const durationDays = Math.floor((tour?.duration || 0) / 24);
  const durationHours = (tour?.duration || 0) % 24;

  const allImages = [
    ...(tour?.images?.main || []),
    ...(tour?.images?.gallery || [])
  ];

  const galleryPreviewImages = [
      ...(tour?.images?.gallery || []),
      ...Array(Math.max(0, 4 - (tour?.images?.gallery?.length || 0))).fill(null)
  ].slice(0, 4);

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
        <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-10 py-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-24"></div>
              ))}
            </div>
            <div className="h-[560px] bg-gray-200 rounded-xl"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{tour?.title} - Experience</title>
      </head>
      
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
        <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-10 py-6">
          
          {error && tour && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center text-yellow-800">
                <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                <span className="text-sm">Some tour data could not be loaded. Showing limited information.</span>
              </div>
            </div>
          )}

          {bookingSuccess && createdBooking && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-800">
                <i className="bi bi-check-circle-fill mr-2 text-xl"></i>
                <div>
                  <p className="font-semibold">Booking Created Successfully!</p>
                  <p className="text-sm">Booking ID: {createdBooking.id} | Status: {createdBooking.status}</p>
                  <p className="text-sm">Redirecting to confirmation...</p>
                </div>
              </div>
            </div>
          )}

          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-[26px] font-semibold text-gray-900 mb-2">
              {tour?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1 text-sm">
              {tour?.rating > 0 && (
                <>
                  <span className="flex items-center gap-1">
                    <i className="bi bi-star-fill text-xs"></i>
                    <span className="font-medium">{tour.rating}</span>
                  </span>
                  <span className="text-gray-500">·</span>
                  <button className="underline font-medium hover:text-black transition">
                    {tour.totalReviews} reviews
                  </button>
                  <span className="text-gray-500">·</span>
                </>
              )}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyBadge(tour?.difficulty)}`}>
                {tour?.difficulty}
              </span>
              <span className="text-gray-500">·</span>
              <button className="underline font-medium hover:text-black transition">
                {tour?.locationCity}, {tour?.locationCountry}
              </button>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="mb-12">
            <div 
              className="grid grid-cols-4 grid-rows-2 gap-2 h-[560px] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setShowPhotoGallery(true)}
            >
              {/* Main large image */}
              <div className="col-span-2 row-span-2 relative group">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center hover:brightness-95 transition duration-200">
                  {tour?.images?.main?.[0] ? (
                    <img src={tour.images.main[0]} alt={tour.title || 'Main tour image'} className='w-full h-full object-cover'/>
                  ) : (
                    <span className="text-gray-500">Image not available</span>
                  )}
                </div>
              </div>

              {/* Four smaller images */}
              {galleryPreviewImages.map((imgUrl, idx) => (
                <div key={idx} className="relative group overflow-hidden">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center hover:brightness-95 transition duration-200">
                    {imgUrl ? (
                      <img src={imgUrl} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <i className="bi bi-image-alt text-3xl text-gray-400"></i>
                    )}
                  </div>
                  {idx === 3 && (tour?.images?.gallery?.length || 0) > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <button 
                        className="bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPhotoGallery(true);
                        }}
                      >
                        <i className="bi bi-grid-3x3-gap"></i>
                        Show all photos
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="lg:col-span-3">
              {/* Tour Header */}
              <div className="border-b pb-8 mb-8">
                <h2 className="text-[22px] font-medium mb-1">
                  {durationDays > 0 ? `${durationDays}-day` : `${durationHours}-hour`} experience hosted by {tour?.tourGuide ? 
                    `${tour.tourGuide.firstName}` : 'Local Expert'}
                </h2>
                <div className="flex flex-wrap gap-1 text-base text-gray-700">
                  <span>{durationDays > 0 ? `${durationDays} days` : `${durationHours} hours`}</span>
                  <span>·</span>
                  <span>Up to {tour?.maxGroupSize} people</span>
                  <span>·</span>
                  <span>Offered in English</span>
                </div>
              </div>

              {/* Tour Highlights */}
              <div className="border-b pb-8 mb-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <i className="bi bi-calendar-x text-2xl"></i>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Free cancellation</div>
                    <div className="text-sm text-gray-600">Cancel up to 24 hours in advance for a full refund</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <i className="bi bi-translate text-2xl"></i>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Offered in English</div>
                    <div className="text-sm text-gray-600">Host speaks English fluently</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <i className="bi bi-people text-2xl"></i>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Small group experience</div>
                    <div className="text-sm text-gray-600">Maximum of {tour?.maxGroupSize} participants</div>
                  </div>
                </div>
                {tour?.tourGuide && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                      <i className="bi bi-award text-2xl"></i>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Expert guide</div>
                      <div className="text-sm text-gray-600">
                        {tour.tourGuide.totalTours} tours completed · {tour.tourGuide.rating || 'No rating yet'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* What you'll do */}
              <div className="border-b pb-8 mb-8">
                <h3 className="text-[22px] font-medium mb-6">What you'll do</h3>
                <div className="text-base leading-relaxed text-gray-800 mb-6">
                  {tour?.description}
                </div>

                {tour?.itinerary && tour.itinerary.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {tour.itinerary.map((item: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{item.title}</div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <span className="text-sm text-gray-500">Duration: {item.duration} hours</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* What's included */}
              <div className="border-b pb-8 mb-8">
                <h3 className="text-[22px] font-medium mb-6">What's included</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  {(tour?.inclusions || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <i className="bi bi-check-lg text-lg mt-0.5"></i>
                      <span className="text-base">{item}</span>
                    </div>
                  ))}
                </div>
                {tour?.exclusions && tour.exclusions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Not included</h4>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                      {tour.exclusions.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <i className="bi bi-x-lg text-lg text-gray-400 mt-0.5"></i>
                          <span className="text-base text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Meeting point */}
              <div className="border-b pb-8 mb-8">
                <h3 className="text-[22px] font-medium mb-6">Where you'll meet</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <i className="bi bi-geo-alt text-xl"></i>
                    <div>
                      <div className="font-medium mb-2">{tour?.meetingPoint}</div>
                      <div className="text-sm text-gray-600">
                        {tour?.locationAddress && <p>{tour.locationAddress}</p>}
                        <p>{tour?.locationCity}, {tour?.locationState}</p>
                        <p>{tour?.locationCountry}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <p className="text-sm text-gray-700">
                      <i className="bi bi-info-circle text-blue-500 mr-2"></i>
                      You'll receive the exact meeting point details after booking confirmation
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest requirements */}
              {tour?.requirements && tour.requirements.length > 0 && (
                <div className="border-b pb-8 mb-8">
                  <h3 className="text-[22px] font-medium mb-6">Guest requirements</h3>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                    {tour.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <i className="bi bi-info-circle text-gray-400"></i>
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available dates section */}
              <div className="border-b pb-8 mb-8">
                <h3 className="text-[22px] font-medium mb-2">Choose from available dates</h3>
                {tour?.schedules && tour.schedules.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {tour.schedules.map((schedule: Schedule) => (
                      <div
                        key={schedule.id}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedSchedule?.id === schedule.id
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setBookingForm(prev => ({ ...prev, scheduleId: schedule.id }));
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {formatDate(schedule.startDate)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {schedule.availableSlots} spots left
                            </p>
                          </div>
                        </div>
                        {selectedSchedule?.id === schedule.id && (
                          <div className="mt-3 pt-3 border-t">
                            <i className="bi bi-check-circle-fill text-gray-900 mr-2"></i>
                            <span className="text-sm font-medium">Selected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-4">No available dates at this time</p>
                )}
              </div>
            </div>

            {/* Right Sidebar - Booking Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="border rounded-xl p-6 shadow-xl">
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-[22px] font-semibold">${tour?.price?.toFixed(2)}</span>
                      <span className="text-gray-600 ml-1">/ person</span>
                    </div>
                    {tour?.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <i className="bi bi-star-fill text-xs"></i>
                        <span className="font-medium">{tour.rating}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{tour.totalReviews} reviews</span>
                      </div>
                    )}
                  </div>

                  {/* Date & Participants Selection */}
                  <div className="space-y-4 mb-6">
                    {selectedSchedule ? (
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-600">Selected date</p>
                            <p className="font-medium mt-1">{formatDate(selectedSchedule.startDate)}</p>
                            <p className="text-sm text-gray-600">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
                          </div>
                          <button 
                            onClick={() => setSelectedSchedule(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-500">Select a date from the list below</p>
                      </div>
                    )}

                    <div className="border rounded-lg p-3 relative">
                      <label className="text-[10px] font-semibold uppercase tracking-wide">Participants</label>
                      <div 
                        onClick={() => setShowParticipantsDropdown(!showParticipantsDropdown)}
                        className="mt-1 text-sm cursor-pointer flex justify-between items-center"
                      >
                        <span>{bookingForm.numberOfParticipants} {bookingForm.numberOfParticipants === 1 ? 'person' : 'people'}</span>
                        <i className={`bi bi-chevron-${showParticipantsDropdown ? 'up' : 'down'}`}></i>
                      </div>
                      {showParticipantsDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-4 z-10">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Participants</span>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateParticipants(Math.max(tour?.minGroupSize || 1, bookingForm.numberOfParticipants - 1))}
                                disabled={bookingForm.numberOfParticipants <= (tour?.minGroupSize || 1)}
                                className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-50"
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="w-8 text-center">{bookingForm.numberOfParticipants}</span>
                              <button 
                                onClick={() => updateParticipants(Math.min(tour?.maxGroupSize || 10, bookingForm.numberOfParticipants + 1))}
                                disabled={bookingForm.numberOfParticipants >= (tour?.maxGroupSize || 10)}
                                className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-50"
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {tour?.minGroupSize && `Min: ${tour.minGroupSize} · `}
                            Max: {tour?.maxGroupSize || 10} participants
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => setShowBookingModal(true)}
                    disabled={!selectedSchedule}
                    className={`w-full py-3 rounded-lg font-medium transition mb-3 ${
                      !selectedSchedule
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700'
                    }`}
                  >
                    {!selectedSchedule ? 'Select date to continue' : 'Book experience'}
                  </button>

                  {selectedSchedule ? (
                    <>
                      <p className="text-center text-sm text-gray-600 mb-4">You won't be charged yet</p>
                      
                      {/* Price Breakdown */}
                      {priceBreakdown && (
                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex justify-between text-base">
                            <button className="underline">
                              ${tour?.price?.toFixed(2)} x {bookingForm.numberOfParticipants} {bookingForm.numberOfParticipants === 1 ? 'person' : 'people'}
                            </button>
                            <span>${priceBreakdown.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <button className="underline">Taxes</button>
                            <span>${priceBreakdown.taxes.toFixed(2)}</span>
                          </div>
                          <div className="pt-3 border-t flex justify-between font-medium">
                            <span>Total</span>
                            <span>${calculateTourTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-sm text-gray-600">Choose a date to see pricing</p>
                  )}

                  {bookingError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <i className="bi bi-exclamation-triangle"></i>
                        {bookingError}
                      </p>
                    </div>
                  )}
                </div>

                {/* Report listing */}
                <div className="mt-6 text-center">
                  <button className="text-gray-500 underline text-sm hover:text-gray-700">
                    <i className="bi bi-flag mr-2"></i>
                    Report this experience
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-12 mt-12">
             <div className="flex items-center gap-2 mb-8">
               <i className="bi bi-star-fill text-xl"></i>
               <h2 className="text-[22px] font-medium">
                 {reviewStats.average} · {reviewStats.total} reviews
               </h2>
             </div>

             {/* Rating Categories Grid */}
             {reviewStats.total > 0 && (
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-4 mb-12 max-w-4xl">
                 <div className="flex items-center justify-between">
                   <span className="text-sm">Overall rating</span>
                   <div className="flex items-center gap-3">
                     <div className="flex-1 bg-gray-200 rounded-full h-1 w-32">
                       <div 
                         className="bg-gray-900 h-1 rounded-full"
                         style={{ width: `${(parseFloat(reviewStats.average) / 5) * 100}%` }}
                       />
                     </div>
                     <span className="text-sm font-medium w-8 text-right">
                       {reviewStats.average}
                     </span>
                   </div>
                 </div>
               </div>
             )}

             {/* Reviews List */}
             {reviewsLoading ? (
               <div className="text-center py-12">
                 <i className="bi bi-arrow-clockwise spin text-2xl mb-2"></i>
                 <p className="text-gray-600">Loading reviews...</p>
               </div>
             ) : reviews.length === 0 ? (
               <div className="text-center py-12 bg-gray-50 rounded-xl">
                 <i className="bi bi-chat-square-text text-4xl text-gray-400 mb-4"></i>
                 <p className="text-xl font-medium mb-2">No reviews yet</p>
                 <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
                 <button 
                   onClick={() => setShowReviewModal(true)}
                   className="px-6 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50 transition"
                 >
                   Write a review
                 </button>
               </div>
             ) : (
               <>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-8 mb-8">
                   {reviews.slice(0, showAllReviews ? reviews.length : 6).map((review) => (
                     <div key={review.id}>
                       <div className="flex items-start gap-3 mb-3">
                         <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                           {review.userName.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <div className="font-medium">{review.userName}</div>
                           <div className="text-sm text-gray-600">{formatDate(review.createdAt)}</div>
                         </div>
                       </div>
                       <div className="flex items-center gap-1 mb-2">
                         {[...Array(5)].map((_, i) => (
                           <i key={i} className={`bi bi-star-fill text-xs ${i < review.rating ? 'text-black' : 'text-gray-300'}`}></i>
                         ))}
                       </div>
                       <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                     </div>
                   ))}
                 </div>

                 {reviews.length > 6 && (
                   <button 
                     onClick={() => setShowAllReviews(!showAllReviews)}
                     className="px-6 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50 transition"
                   >
                     {showAllReviews ? 'Show less' : `Show all ${reviews.length} reviews`}
                   </button>
                 )}

                 <button 
                   onClick={() => setShowReviewModal(true)}
                   className="ml-4 px-6 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50 transition"
                 >
                   Write a review
                 </button>
               </>
             )}
           </div>

          {/* Meet your host */}
          {tour?.tourGuide && (
            <div className="border-t pt-12 mt-12">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-[22px] font-medium mb-6">Meet your host</h2>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {tour.tourGuide.profileImage ? (
                        <img src={tour.tourGuide.profileImage} alt={`${tour.tourGuide.firstName} ${tour.tourGuide.lastName}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-2xl font-medium">
                          {tour.tourGuide.firstName?.[0]}{tour.tourGuide.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">
                        {tour.tourGuide.firstName} {tour.tourGuide.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">Host since 2024</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm">
                      <i className="bi bi-star-fill"></i>
                      <span>{tour.tourGuide.rating || 'New host'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <i className="bi bi-shield-check"></i>
                      <span>Identity verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <i className="bi bi-award"></i>
                      <span>{tour.tourGuide.totalTours} experiences hosted</span>
                    </div>
                  </div>

                  <p className="text-gray-800 leading-relaxed mb-8">
                    Hi! I'm your local expert guide passionate about sharing the best of {tour.locationCity} with 
                    visitors from around the world. I look forward to showing you the hidden gems and stories 
                    that make this place special.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <i className="bi bi-shield-check text-2xl text-red-500"></i>
                    <div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        To protect your payment, never transfer money or communicate outside of the RentSpaces website or app.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Things to know */}
          <div className="border-t pt-12 mt-12 mb-12">
            <h2 className="text-[22px] font-medium mb-8">Things to know</h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3 className="font-medium mb-4">Cancellation policy</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Free cancellation up to 24 hours before the experience starts.</p>
                  <p>Cancel within 24 hours of your experience starting time and the full amount will be charged.</p>
                  <button className="font-medium underline">Show more</button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Health & safety</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Committed to health and safety process</p>
                  <p>Small group sizes</p>
                  <p>Physical distancing enforced</p>
                  <button className="font-medium underline">Show more</button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Guest requirements</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Minimum age: 12</p>
                  <p>Max group size: {tour?.maxGroupSize}</p>
                  <p>Experience level: {tour?.difficulty}</p>
                  <button className="font-medium underline">Show more</button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Modal */}
          {showBookingModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="sticky top-0 bg-white border-b p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Complete your booking</h3>
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium mb-2">{tour?.title}</h4>
                    <div className="text-sm text-gray-600">
                      <p>{selectedSchedule ? formatDate(selectedSchedule.startDate) : 'No date selected'}</p>
                      <p className="mt-1">{bookingForm.numberOfParticipants} {bookingForm.numberOfParticipants === 1 ? 'person' : 'people'} · ${calculateTourTotal().toFixed(2)} total</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Number of participants</h4>
                      <select
                        value={bookingForm.numberOfParticipants}
                        onChange={(e) => updateParticipants(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        {Array.from({ length: (tour?.maxGroupSize || 1) - (tour?.minGroupSize || 1) + 1 }, (_, i) => (
                          <option key={i} value={(tour?.minGroupSize || 1) + i}>
                            {(tour?.minGroupSize || 1) + i} {((tour?.minGroupSize || 1) + i) === 1 ? 'participant' : 'participants'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {bookingForm.participants.map((participant, index) => (
                      <div key={index} className="border rounded-xl p-6 bg-gray-50">
                        <h5 className="font-medium mb-4">Participant {index + 1}</h5>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              placeholder="Full name"
                              value={participant.name}
                              onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <input
                              type="number"
                              placeholder="Age"
                              value={participant.age}
                              onChange={(e) => updateParticipant(index, 'age', e.target.value)}
                              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <input
                              type="email"
                              placeholder="Email (optional)"
                              value={participant.email}
                              onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>

                          <div>
                            <h6 className="font-medium mb-2 text-sm">Emergency contact</h6>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input
                                type="text"
                                placeholder="Contact name"
                                value={participant.emergencyContactName}
                                onChange={(e) => updateParticipant(index, 'emergencyContactName', e.target.value)}
                                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                              />
                              <input
                                type="tel"
                                placeholder="Contact phone"
                                value={participant.emergencyContactPhone}
                                onChange={(e) => updateParticipant(index, 'emergencyContactPhone', e.target.value)}
                                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                              />
                              <select
                                value={participant.emergencyContactRelationship}
                                onChange={(e) => updateParticipant(index, 'emergencyContactRelationship', e.target.value)}
                                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                              >
                                <option value="">Relationship</option>
                                <option value="Parent">Parent</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Child">Child</option>
                                <option value="Partner">Partner</option>
                                <option value="Friend">Friend</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <h6 className="font-medium mb-2 text-sm">Additional information (optional)</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <textarea
                                placeholder="Special requirements (dietary, accessibility, etc.)"
                                value={participant.specialRequirements}
                                onChange={(e) => updateParticipant(index, 'specialRequirements', e.target.value)}
                                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                rows={3}
                              />
                              <textarea
                                placeholder="Medical conditions (allergies, medications, etc.)"
                                value={participant.medicalConditions}
                                onChange={(e) => updateParticipant(index, 'medicalConditions', e.target.value)}
                                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="block font-medium mb-2">Special requests (optional)</label>
                      <textarea
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        rows={3}
                        placeholder="Let your host know if you have any special requests..."
                      />
                    </div>

                    {bookingError && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-red-600 text-sm">{bookingError}</p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setShowBookingModal(false)}
                        className="flex-1 py-3 border border-gray-900 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBookingSubmit}
                        disabled={bookingLoading || !isBookingFormComplete()}
                        className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                      >
                        {bookingLoading ? 'Processing...' : 'Confirm and proceed'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ReviewModal
            isOpen={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            onSubmit={handleReviewSubmit}
            loading={loading}
          />

          <PhotoGalleryModal
            isOpen={showPhotoGallery}
            onClose={() => setShowPhotoGallery(false)}
            images={allImages}
          />
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}