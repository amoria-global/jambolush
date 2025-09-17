// app/all/property/[id]/page.tsx
"use client";
import AddReviewForm from '@/app/components/forms/add-review-home';
import AlertNotification from '@/app/components/notify';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import api, { PropertyInfo, PropertyImages, BackendResponse } from '@/app/api/apiService';
import { decodeId, encodeId } from '@/app/utils/encoder';

interface HousePageProps {
  params: Promise<{
    id: string;
  }>;
}
 
// Booking interfaces
interface CreatePropertyBookingDto {
  propertyId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
  specialRequests?: string;
  totalPrice: number;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    propertyId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    message?: string;
  };
  errors?: string[];
}

// Review interface
interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

// Alert notification state interface
interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

// Transform backend PropertyImages to frontend photos array
const transformPropertyImages = (images: PropertyImages): string[] => {
  const allPhotos: string[] = [];
  
  // Priority order for photos
  const photoCategories: (keyof PropertyImages)[] = [
    'exterior',
    'livingRoom', 
    'bedroom',
    'kitchen',
    'bathroom',
    'diningArea',
    'workspace',
    'balcony',
    'laundryArea',
    'gym',
    'childrenPlayroom'
  ];
  
  photoCategories.forEach(category => {
    if (images[category] && Array.isArray(images[category])) {
      allPhotos.push(...images[category]);
    }
  });
  
  return allPhotos;
};

// Transform backend PropertyInfo to frontend house format
const transformPropertyData = (backendProperty: PropertyInfo) => {
  const photos = transformPropertyImages(backendProperty.images);
  
  return {
    title: backendProperty.name,
    bedrooms: backendProperty.beds,
    bathrooms: backendProperty.baths,
    kitchen: 1, // Assume 1 kitchen, you can modify this logic
    guests: backendProperty.maxGuests,
    price: backendProperty.pricePerNight,
    address: backendProperty.location,
    coordinates: { lat: 25.7617, lng: -80.1918 }, // Default coordinates - you might want to add these to your backend
    description: backendProperty.description || 'No description available.',
    photos: photos.length > 0 ? photos : [
      // Fallback photos if none available
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
    ],
    videoUrl: backendProperty.video3D || '',
    ratings: {
      overall: backendProperty.rating,
      accuracy: 4.9,
      cleanliness: 4.7,
      checkin: 4.8,
      communication: 5.0,
      location: 4.6,
      value: 4.5
    },
    totalReviews: backendProperty.reviewsCount,
    ratingCounts: { 
      5: Math.floor(backendProperty.reviewsCount * 0.8), 
      4: Math.floor(backendProperty.reviewsCount * 0.15), 
      3: Math.floor(backendProperty.reviewsCount * 0.03), 
      2: Math.floor(backendProperty.reviewsCount * 0.02), 
      1: 0 
    },
    // Use real blocked dates from availability
    blockedDates: backendProperty.availability?.blockedDates || [],
    availability: backendProperty.availability
  };
};

export default function HousePage({ params }: HousePageProps) {
  const resolvedParams = use(params);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [dateError, setDateError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [guests, setGuests] = useState(1);
  
  // Backend integration state
  const [house, setHouse] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [occupiedDates, setOccupiedDates] = useState<{start: string, end: string}[]>([]);
  
  // Alert notification state
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'info'
  });

  // Property ID validation state
  const [validPropertyId, setValidPropertyId] = useState<any | null>(null);
  const [invalidId, setInvalidId] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  
  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Validate and decode property ID
  useEffect(() => {
    if (!resolvedParams.id) {
      setError('No property ID provided');
      setInvalidId(true);
      setLoading(false);
      return;
    }

    
    // Decode the property ID
    const decodedId = decodeId(resolvedParams.id);

    if (!decodedId) {
      setError('Unable to decode property ID');
      setInvalidId(true);
      setLoading(false);
      return;
    }

    setValidPropertyId(decodedId);
  }, [resolvedParams.id]);

  // Show alert notification
  const showAlert = (message: string, type: AlertState['type'], duration = 5000) => {
    setAlert({
      show: true,
      message,
      type,
      duration
    });
  };

  // Hide alert notification
  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Fetch property data from backend
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!validPropertyId) return;

      try {
        setLoading(true);
        setError(null);
        
        // Use the decoded numeric ID for API call
        const response = await api.getProperty(validPropertyId);
        
        if (response.data.success) {
          const transformedHouse = transformPropertyData(response.data.data);
          setHouse(transformedHouse);
          
          // Convert blocked dates to occupied dates format
          const blocked = response.data.data.availability?.blockedDates || [];
          setOccupiedDates(blocked.map((dateRange: any) => ({
            start: dateRange.start || dateRange.startDate,
            end: dateRange.end || dateRange.endDate
          })));

          showAlert('Property loaded successfully', 'success', 3000);
        } else {
          throw new Error(response.data.message || 'Failed to fetch property');
        }
      } catch (err: any) {
        console.error('Failed to fetch property:', err);
        const errorMessage = err?.message || 'Failed to load property';
        setError(errorMessage);
        showAlert(`Error: ${errorMessage}`, 'error');
        
        // Fallback to sample data if API fails
        setHouse({
          title: 'Property Not Found',
          bedrooms: 0,
          bathrooms: 0,
          kitchen: 0,
          guests: 0,
          price: 0,
          address: 'Address not available',
          coordinates: { lat: 25.7617, lng: -80.1918 },
          description: 'Property data could not be loaded.',
          photos: [],
          videoUrl: '',
          ratings: { overall: 0, accuracy: 0, cleanliness: 0, checkin: 0, communication: 0, location: 0, value: 0 },
          totalReviews: 0,
          ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [validPropertyId]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      if (!validPropertyId) return;
      
      try {
        setReviewsLoading(true);
        const response = await api.get(`/properties/${validPropertyId}/reviews`);
        
        if (response.data.success) {
          // Transform backend review data to frontend format
          const transformedReviews = response.data.map((review: any) => ({
            id: review.id,
            name: review.userName || review.guestName || 'Anonymous',
            date: new Date(review.createdAt).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            }),
            rating: review.rating,
            comment: review.comment || review.reviewText || ''
          }));
          setReviews(transformedReviews);
        }
      } catch (err: any) {
        console.error('Failed to fetch reviews:', err);
        // Keep reviews empty if fetch fails
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [validPropertyId]);

  // Helper function to check if a single date is occupied
  const isDateInOccupiedRange = (date: string) => {
    const checkDate = new Date(date);
    return occupiedDates.some(period => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);
      return checkDate >= periodStart && checkDate <= periodEnd;
    });
  };

  // Helper function to check if a date range overlaps with occupied dates
  const isRangeOccupied = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return occupiedDates.some(period => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);
      
      return (start >= periodStart && start <= periodEnd) ||
             (end >= periodStart && end <= periodEnd) ||
             (start <= periodStart && end >= periodEnd);
    });
  };

  // Validate reservation data
  const validateReservation = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!checkInDate) {
      errors.push('Check-in date is required');
    }

    if (!checkOutDate) {
      errors.push('Check-out date is required');
    }

    if (checkInDate && checkOutDate) {
      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        errors.push('Check-out date must be after check-in date');
      }

      if (isRangeOccupied(checkInDate, checkOutDate)) {
        errors.push('Selected dates are not available');
      }
    }

    if (!guests || guests < 1) {
      errors.push('At least 1 guest is required');
    }

    if (guests > (house?.guests || 1)) {
      errors.push(`Maximum ${house?.guests} guests allowed`);
    }

    if (!validPropertyId) {
      errors.push('Invalid property ID');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle check-in date change with validation
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    
    if (isDateInOccupiedRange(newDate)) {
      setDateError('Check-in date is not available. Please select another date.');
      setCheckInDate('');
      showAlert('Check-in date is not available', 'warning');
      return;
    }
    
    setCheckInDate(newDate);
    setDateError('');
    setBookingError(null);
    hideAlert();
    
    // If check-out is set and creates an occupied range, clear it
    if (checkOutDate && isRangeOccupied(newDate, checkOutDate)) {
      setCheckOutDate('');
      setDateError('This date range includes occupied dates. Please select new dates.');
      showAlert('Date range includes occupied dates', 'warning');
    }
  };

  // Handle check-out date change with validation
  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    
    if (isDateInOccupiedRange(newDate)) {
      setDateError('Check-out date is not available. Please select another date.');
      setCheckOutDate('');
      showAlert('Check-out date is not available', 'warning');
      return;
    }
    
    if (checkInDate && isRangeOccupied(checkInDate, newDate)) {
      setDateError('This date range includes occupied dates. Please select different dates.');
      setCheckOutDate('');
      showAlert('Date range includes occupied dates', 'warning');
      return;
    }
    
    setCheckOutDate(newDate);
    setDateError('');
    setBookingError(null);
    hideAlert();
  };

  // Create property booking via API
  const handleReserve = async () => {
    // Validate reservation data
    const validation = validateReservation();
    if (!validation.isValid) {
      const errorMessage = validation.errors.join('. ');
      setDateError(errorMessage);
      showAlert(`Validation failed: ${errorMessage}`, 'error');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(false);
      hideAlert();
      
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        const loginMessage = 'Please log in to make a booking';
        setBookingError(loginMessage);
        showAlert(loginMessage, 'warning');
        router.push(`/all/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // Prepare booking data using the decoded property ID
      const bookingData: CreatePropertyBookingDto = {
        propertyId: parseInt(validPropertyId)!,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guests,
        message: 'Booking request from property page',
        specialRequests: '',
        totalPrice: calculateTotal(),
      };

      // Make API call to create booking
      api.setAuth(token);
      const response = await api.post('/properties/bookings', bookingData);
      
      // Parse the response
      const result: BookingResponse = response.data;

      // Handle different response scenarios
      if (response.ok && result.success && result.data) {
        // Success case
        setBookingSuccess(true);
        setCreatedBooking(result.data);
        
        // Show success notification
        showAlert('Booking created successfully! Redirecting to payment...', 'success', 3000);
        
        // Encode the booking ID for secure URL
        const encodedBookingId = encodeId(result.data.id);
        
        // Navigate to confirm and pay page with encoded booking ID
        setTimeout(() => {
          router.push(`/all/property/${resolvedParams.id}/confirm-and-pay?bookingId=${encodedBookingId}`);
        }, 2000);
        
      } else {
        // Handle API errors with user-friendly messages
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (result.data?.message) {
          errorMessage = result.data.message;
        } else if (result.message) {
          errorMessage = result.message;
        }
        
        // Categorize the error for better UX
        if (errorMessage.toLowerCase().includes('not available') || 
            errorMessage.toLowerCase().includes('dates')) {
          setDateError(errorMessage);
          showAlert(errorMessage, 'error');
        } else if (errorMessage.toLowerCase().includes('login') || 
                  errorMessage.toLowerCase().includes('auth')) {
          setBookingError('Please log in to continue');
          showAlert('Authentication required. Redirecting to login...', 'warning');
          router.push(`/all/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        } else {
          setBookingError(errorMessage);
          showAlert(`Booking failed: ${errorMessage}`, 'error');
        }
      }

    } catch (error: any) {
      console.error('Booking creation error:', error);
      
      // Handle network and parsing errors
      let userMessage = 'Unable to process your booking. Please check your connection and try again.';
      
      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const responseData = error.data;
        
        switch (statusCode) {
          case 400:
            if (responseData?.data?.message) {
              userMessage = responseData.data.message;
            } else if (responseData?.message) {
              userMessage = responseData.message;
            } else {
              userMessage = 'Invalid booking details. Please check your dates and try again.';
            }
            break;
          case 401:
            userMessage = 'Please log in to make a booking';
            showAlert('Authentication expired. Redirecting to login...', 'warning');
            router.push(`/all/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            break;
          case 403:
            userMessage = 'You do not have permission to make this booking';
            break;
          case 404:
            userMessage = 'Property not found. Please refresh the page and try again.';
            break;
          case 409:
            userMessage = 'These dates are no longer available. Please select different dates.';
            break;
          case 500:
            userMessage = 'Server error. Please try again in a few minutes.';
            break;
          default:
            userMessage = 'Something went wrong. Please try again.';
        }
        
        // Categorize error for display
        if (userMessage.toLowerCase().includes('dates') || 
            userMessage.toLowerCase().includes('available')) {
          setDateError(userMessage);
        } else if (statusCode !== 401) {  // 401 already handled above
          setBookingError(userMessage);
        }
        
        if (statusCode !== 401) {
          showAlert(userMessage, 'error');
        }
        
      } else if (error.request) {
        // Network error
        setBookingError('Network error. Please check your connection and try again.');
        showAlert('Network error. Please check your connection and try again.', 'error');
      } else {
        // Other error
        setBookingError('An unexpected error occurred. Please try again.');
        showAlert('An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (checkInDate && checkOutDate && house) {
      const days = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days * house.price : 0;
    }
    return 0;
  };

  const handleUpdateReviewArray = (newReview: any) => {
    setReviews(prev => [...prev, newReview]);
    setShowAllReviews(true);
    showAlert('Review added successfully!', 'success');
  };

  // Reset booking states when dates change
  useEffect(() => {
    setBookingSuccess(false);
    setBookingError(null);
    setCreatedBooking(null);
  }, [checkInDate, checkOutDate, guests]);

  // Invalid ID state
  if (invalidId) {
    return (
      <div className="mt-14 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 text-lg font-medium mb-2">
                <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                Invalid Property ID
              </div>
              <p className="text-red-500 text-sm mb-4">
                The property ID in the URL is invalid or corrupted. Please check the link and try again.
              </p>
              <button
                onClick={() => router.push('/all/properties')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mr-2"
              >
                Browse Properties
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="mt-14 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="animate-pulse">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="flex gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-24"></div>
              ))}
            </div>
            
            {/* Photo skeleton */}
            <div className="h-96 bg-gray-300 rounded-xl mb-8"></div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

  // Error state
  if (error && !house) {
    return (
      <div className="mt-14 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 text-lg font-medium mb-2">
                Unable to load property
              </div>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{house?.title}</title>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Error banner if there was an error but fallback data is shown */}
          {error && house && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center text-yellow-800">
                <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                <span className="text-sm">Some property data could not be loaded. Showing limited information.</span>
              </div>
            </div>
          )}

          {/* Booking Success Message */}
          {bookingSuccess && createdBooking && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-800">
                <i className="bi bi-check-circle-fill mr-2 text-xl"></i>
                <div>
                  <p className="font-semibold">Booking Created Successfully!</p>
                  <p className="text-sm">Booking ID: {(createdBooking.id).toUpperCase()} | Status: {createdBooking.status}</p>
                  <p className="text-sm">Redirecting to payment...</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Title Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#083A85] mb-3 sm:mb-4 leading-tight">
              {house?.title}
            </h1>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 lg:gap-6 text-base sm:text-base text-gray-700">
              <span className="flex items-center gap-2">
                <i className="bi bi-door-open text-[#F20C8F] text-lg sm:text-xl"></i>
                <span className="font-medium">{house?.bedrooms} Bedrooms</span>
              </span>
              <span className="flex items-center gap-2">
                <i className="bi bi-droplet text-[#F20C8F] text-lg sm:text-xl"></i>
                <span className="font-medium">{house?.bathrooms} Bathrooms</span>
              </span>
              <span className="flex items-center gap-2">
                <i className="bi bi-house-door text-[#F20C8F] text-lg sm:text-xl"></i>
                <span className="font-medium">{house?.kitchen} Kitchen</span>
              </span>
              <span className="flex items-center gap-2">
                <i className="bi bi-people text-[#F20C8F] text-lg sm:text-xl"></i>
                <span className="font-medium">Up to {house?.guests} Guests</span>
              </span>
            </div>
          </div>

          {/* Photos Section */}
          <div className="mb-8 sm:mb-12">
            {house?.photos && house.photos.length > 0 && (
              <>
                {/* Mobile: Single large image with carousel */}
                <div className="block sm:hidden">
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <img 
                      src={house.photos[selectedPhoto]}
                      alt={`House view ${selectedPhoto + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {house.photos.map((_: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhoto(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === selectedPhoto ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                    <button 
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-base font-medium"
                      onClick={() => router.push(`${pathname}/photos`)}
                    >
                      <i className="bi bi-grid-3x3-gap mr-1"></i>
                      All photos
                    </button>
                  </div>
                </div>

                {/* Tablet: 2x2 grid */}
                <div className="hidden sm:block lg:hidden">
                  <div className="grid grid-cols-2 gap-2 h-[400px] rounded-xl overflow-hidden relative">
                    {house.photos.slice(0, 4).map((photo: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="relative group cursor-pointer overflow-hidden"
                        onClick={() => setSelectedPhoto(idx)}
                      >
                        <img 
                          src={photo}
                          alt={`House view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      </div>
                    ))}
                    <button 
                      className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow text-base font-medium"
                      onClick={() => router.push(`${pathname}/photos`)}
                    >
                      <i className="bi bi-grid-3x3-gap"></i>
                      Show all photos
                    </button>
                  </div>
                </div>

                {/* Desktop: 4x4 grid */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-4 gap-2 h-[500px] rounded-xl overflow-hidden relative">
                    <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setSelectedPhoto(0)}>
                      <img 
                        src={house.photos[0]}
                        alt="Primary house view"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                    {house.photos.slice(1).map((photo: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="relative group cursor-pointer overflow-hidden"
                        onClick={() => setSelectedPhoto(idx + 1)}
                      >
                        <img 
                          src={photo}
                          alt={`House view ${idx + 2}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      </div>
                    ))}
                    <button 
                      className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => router.push(`${pathname}/photos`)}
                    >
                      <i className="bi bi-grid-3x3-gap"></i>
                      <span className="text-base font-medium">Show all photos</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Booking Section - Above location */}
          <div className="block lg:hidden mb-8">
            <div className="border-2 border-[#083A85] rounded-xl p-4 sm:p-6 shadow-xl bg-white">
              <h3 className="text-lg sm:text-xl font-semibold text-[#083A85] mb-4">Reserve Your Stay</h3>
              <div className="mb-6">
                <p className="text-2xl sm:text-3xl font-bold text-[#F20C8F]">${house?.price}</p>
                <p className="text-gray-600 text-base sm:text-base">per night</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      <i className="bi bi-calendar-check mr-1"></i>
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkInDate}
                      onChange={handleCheckInChange}
                      disabled={bookingLoading || bookingSuccess}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-base sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      <i className="bi bi-calendar-x mr-1"></i>
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      min={checkInDate || today}
                      value={checkOutDate}
                      onChange={handleCheckOutChange}
                      disabled={bookingLoading || bookingSuccess}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-base sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-people mr-1"></i>
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    disabled={bookingLoading || bookingSuccess}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition text-base sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {Array.from({ length: house?.guests || 8 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} guest{num !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {dateError && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-600 text-base font-medium">
                      <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                      {dateError}
                    </p>
                  </div>
                )}

                {bookingError && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-600 text-base font-medium">
                      <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                      {bookingError}
                    </p>
                  </div>
                )}

                {occupiedDates.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-base mb-2 text-gray-700">Unavailable Dates:</p>
                    <div className="space-y-1">
                      {occupiedDates.map((period, idx) => (
                        <div key={idx} className="text-xs text-red-600 flex items-center gap-1">
                          <i className="bi bi-calendar-x-fill text-xs"></i>
                          <span>{new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {checkInDate && checkOutDate && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-base mb-2">
                      <span>Nights:</span>
                      <span className="font-semibold">{Math.max(0, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-[#F20C8F]">${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReserve}
                  disabled={!checkInDate || !checkOutDate || !!dateError || bookingLoading || bookingSuccess}
                  className={`w-full py-3 rounded-lg font-semibold transition text-base sm:text-base ${
                    (!checkInDate || !checkOutDate || !!dateError || bookingLoading || bookingSuccess)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#F20C8F] text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl cursor-pointer'
                  }`}
                >
                  {bookingLoading ? (
                    <>
                      <i className="bi bi-arrow-clockwise spin mr-2"></i>
                      Creating Booking...
                    </>
                  ) : bookingSuccess ? (
                    <>
                      <i className="bi bi-check-circle-fill mr-2"></i>
                      Booking Created!
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-heart mr-2"></i>
                      Reserve Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Address & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Location</h2>
            <div className="flex items-start gap-2 mb-4">
              <i className="bi bi-geo-alt-fill text-[#F20C8F] text-lg sm:text-xl mt-0.5 flex-shrink-0"></i>
              <p className="text-gray-700 font-medium text-base sm:text-base leading-relaxed">{house?.address}</p>
            </div>
            <div className="w-full h-[250px] sm:h-[300px] lg:h-[750px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(house?.address || '')}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            {/* Description moved here for mobile */}
            <div className="mt-6 lg:hidden">
              <h3 className="text-lg font-semibold text-[#083A85] mb-3">About This Place</h3>
              <p className="text-gray-700 text-base sm:text-base leading-relaxed">{house?.description}</p>
            </div>
          </div>

          {/* Desktop Booking Window */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="border-2 border-[#083A85] rounded-xl p-6 shadow-xl sticky top-8">
              <h3 className="text-xl font-semibold text-[#083A85] mb-4">Reserve Your Stay</h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-[#F20C8F]">${house?.price}</p>
                <p className="text-gray-600">per night</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-calendar-check mr-1"></i>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkInDate}
                    onChange={handleCheckInChange}
                    disabled={bookingLoading || bookingSuccess}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-calendar-x mr-1"></i>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={handleCheckOutChange}
                    disabled={bookingLoading || bookingSuccess}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">
                    <i className="bi bi-people mr-1"></i>
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    disabled={bookingLoading || bookingSuccess}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {Array.from({ length: house?.guests || 8 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} guest{num !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {dateError && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-600 text-base font-medium">
                      <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                      {dateError}
                    </p>
                  </div>
                )}

                {bookingError && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-600 text-base font-medium">
                      <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                      {bookingError}
                    </p>
                  </div>
                )}

                {occupiedDates.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-base mb-2 text-gray-700">Unavailable Dates:</p>
                    <div className="space-y-1">
                      {occupiedDates.map((period, idx) => (
                        <div key={idx} className="text-xs text-red-600 flex items-center gap-1">
                          <i className="bi bi-calendar-x-fill text-xs"></i>
                          <span>{new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {checkInDate && checkOutDate && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-base mb-2">
                      <span>Nights:</span>
                      <span className="font-semibold">{Math.max(0, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-[#F20C8F]">${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReserve}
                  disabled={!checkInDate || !checkOutDate || !!dateError || bookingLoading || bookingSuccess}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    (!checkInDate || !checkOutDate || !!dateError || bookingLoading || bookingSuccess)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#F20C8F] text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl cursor-pointer'
                  }`}
                >
                  {bookingLoading ? (
                    <>
                      <i className="bi bi-arrow-clockwise spin mr-2"></i>
                      Creating Booking...
                    </>
                  ) : bookingSuccess ? (
                    <>
                      <i className="bi bi-check-circle-fill mr-2"></i>
                      Booking Created!
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-heart mr-2"></i>
                      Reserve Now
                    </>
                  )}
                </button>

                <div className="pt-4 border-t">
                  <p className="text-base text-gray-600 leading-relaxed">{house?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Video Preview */}
        {house?.videoUrl && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">3D Virtual Tour</h2>
            <div className="w-full h-[250px] sm:h-[350px] lg:h-[600px] rounded-xl overflow-hidden shadow-xl">
              {house.videoUrl.includes('youtube.com') || house.videoUrl.includes('youtu.be') ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`${house.videoUrl}${house.videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1`}
                  title="Property Virtual Tour"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <video
                  width="100%"
                  height="100%"
                  autoPlay
                  muted
                  loop
                  controls
                  className="w-full h-full object-cover"
                >
                  <source src={house.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        )}

        {/* Ratings Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4 sm:mb-6">Guest Ratings & Reviews</h2>
          
          {/* Overall Rating */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="text-center sm:text-left">
                <span className="text-4xl sm:text-5xl font-bold text-[#083A85]">{house?.ratings?.overall || 0}</span>
                <div className="flex gap-1 mt-2 justify-center sm:justify-start">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`bi bi-star-fill text-[#F20C8F] text-base sm:text-lg`}></i>
                  ))}
                </div>
                <p className="text-gray-600 font-medium mt-1 text-base sm:text-base">{house?.totalReviews || 0} reviews</p>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className="w-4 text-base font-medium">{rating}</span>
                    <i className="bi bi-star-fill text-[#F20C8F] text-base"></i>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                      <div 
                        className="bg-[#F20C8F] h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{ width: house?.ratingCounts && house?.totalReviews ? `${(house.ratingCounts[rating as keyof typeof house.ratingCounts] / house.totalReviews) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-base text-gray-600 w-8 sm:w-12 text-right">
                      {house?.ratingCounts ? house.ratingCounts[rating as keyof typeof house.ratingCounts] : 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {Object.entries({
              accuracy: { icon: 'bi-check-circle-fill', label: 'Accuracy' },
              cleanliness: { icon: 'bi-stars', label: 'Cleanliness' },
              checkin: { icon: 'bi-key-fill', label: 'Check-in' },
              communication: { icon: 'bi-chat-dots-fill', label: 'Communication' },
              location: { icon: 'bi-geo-alt-fill', label: 'Location' },
              value: { icon: 'bi-tag-fill', label: 'Value' }
            }).map(([key, { icon, label }]) => (
              <div key={key} className="bg-white border-2 border-gray-100 rounded-xl p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                <i className={`bi ${icon} text-xl sm:text-2xl text-[#083A85] mb-2`}></i>
                <p className="text-xs sm:text-base font-semibold text-gray-700">{label}</p>
                <p className="text-lg sm:text-xl font-bold text-[#F20C8F] mt-1">
                  {house?.ratings?.[key as keyof typeof house.ratings] || 0}
                </p>
              </div>
            ))}
          </div>

          {/* Reviews Summary */}
          <div className="border-t pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[#083A85]">Guest Reviews</h3>
              <button className="w-full sm:w-auto px-4 sm:px-5 py-2 border-2 border-[#083A85] text-[#083A85] rounded-lg font-semibold hover:bg-[#083A85] hover:text-white transition-all text-base sm:text-base cursor-pointer"
                      onClick={() => setShowReviewModal(true)}>
                <i className="bi bi-plus-circle mr-2"></i>
                Add Review
              </button>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-8">
                <i className="bi bi-arrow-clockwise spin text-2xl text-[#083A85] mb-2"></i>
                <p className="text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <i className="bi bi-chat-square-text text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600 text-lg">No reviews yet</p>
                <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                  <div key={review.id} className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3">
                      <div>
                        <p className="font-semibold text-[#083A85] text-base sm:text-base">{review.name}</p>
                        <p className="text-xs sm:text-base text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`bi bi-star-fill text-base ${i < review.rating ? 'text-[#F20C8F]' : 'text-gray-300'}`}></i>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base sm:text-base">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {reviews.length > 3 && (
              <div className="text-center mt-6 sm:mt-8">
                <button 
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#083A85] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl text-base sm:text-base"
                >
                  <i className={`bi bi-${showAllReviews ? 'chevron-up' : 'chevron-down'} mr-2`}></i>
                  {showAllReviews ? 'Show Less Reviews' : `See All ${reviews.length} Reviews`}
                </button>
              </div>
            )}
          </div>
        </div>

          {/* Add Review Modal */}
          {showReviewModal && ( 
            <AddReviewForm 
              propertyId={validPropertyId!} 
              onClose={() => setShowReviewModal(false)} 
              onAddReview={handleUpdateReviewArray} 
            /> 
          )}
        </div>
      </div>

      {/* Add some CSS for the spinner animation */}
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