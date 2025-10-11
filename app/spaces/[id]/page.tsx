// app/all/property/[id]/page.tsx
"use client";
import AddReviewForm from '@/app/components/forms/add-review-home';
import AlertNotification from '@/app/components/notify';
import CustomDatePicker from '@/app/components/forms/custome-date-picker';
import PhotoViewerModal from '@/app/components/forms/photo-viewers';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, use } from 'react';
import api, { PropertyInfo, PropertyImages, BackendResponse } from '@/app/api/apiService';
import { decodeId, encodeId } from '@/app/utils/encoder';
import { calculateDisplayPrice, calculateBookingTotal, calculatePriceBreakdown, formatPrice } from '@/app/utils/pricing';

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

// Format date to "MMM DD, YYYY HH:MM:SS   X time ago"
function formatDate(dateString: string | any, relativeOnly: boolean = false): string {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    // --- Absolute date formatting ---
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
                    "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const absolute = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;

    // --- Relative time ---
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let relative: string;
    if (diffSec < 60) relative = `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
    else if (diffMin < 60) relative = `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    else if (diffHour < 24) relative = `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    else if (diffDay === 1) relative = 'Yesterday';
    else if (diffDay < 7) relative = `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    else if (diffDay < 30) relative = `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) !== 1 ? 's' : ''} ago`;
    else if (diffDay < 365) relative = `${Math.floor(diffDay / 30)} month${Math.floor(diffDay / 30) !== 1 ? 's' : ''} ago`;
    else relative = `${Math.floor(diffDay / 365)} year${Math.floor(diffDay / 365) !== 1 ? 's' : ''} ago`;

    // Decide output
    return relativeOnly ? relative : `${absolute}   ${relative}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

// Transform backend PropertyInfo to frontend house format
const transformPropertyData = (backendProperty: PropertyInfo) => {
  const photos = transformPropertyImages(backendProperty.images);

  // Calculate display price from base price (base price + 10%)
  const basePricePerNight = backendProperty.pricePerNight;
  const displayPrice = calculateDisplayPrice(basePricePerNight);

  const reviewsCount = backendProperty.reviewsCount || 0;
  const rating = backendProperty.rating || 0;

  return {
    title: backendProperty.name,
    bedrooms: backendProperty.beds,
    bathrooms: backendProperty.baths,
    kitchen: backendProperty.features?.includes('Kitchen') ? 1 : 0,
    guests: backendProperty.maxGuests,
    price: displayPrice, // Display price for UI (base + 10%)
    basePrice: basePricePerNight, // Keep base price for calculations
    address: backendProperty.location,
    coordinates: { lat: -1.9441, lng: 30.0619 }, // Kigali coordinates
    description: backendProperty.description || '',
    photos: photos,
    videoUrl: backendProperty.video3D || '',
    ratings: {
      overall: rating
    },
    totalReviews: reviewsCount,
    blockedDates: backendProperty.availability?.blockedDates || [],
    availability: backendProperty.availability,
    hostName: backendProperty.hostName || '',
    hostProfileImage: backendProperty.hostProfileImage || null,
    features: backendProperty.features || [],
    type: backendProperty.type || '',
    category: backendProperty.category || '',
    status: backendProperty.status || '',
    isVerified: backendProperty.isVerified || false,
    createdAt: formatDate(backendProperty.createdAt) || '',
    
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
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
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
  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [backendProperty, setBackendProperty] = useState<any>(null);

  // Alert notification state
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: '',
    type: 'info'
  });

  // Property ID validation state
  const [validPropertyId, setValidPropertyId] = useState<any | null>(null);
  const [invalidId, setInvalidId] = useState(false);

  // Video refs and state for auto-play functionality
  const videoRef = useRef<HTMLIFrameElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Fallback image URL for when images fail to load
  const fallbackImageUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop';

  const openPhotoViewer = (index: number = 0) => {
    setSelectedPhotoIndex(index);
    setShowPhotoViewer(true);
  };

  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackImageUrl) {
      target.src = fallbackImageUrl;
    }
  };

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
          setBackendProperty(response.data.data);
          const transformedHouse = transformPropertyData(response.data.data);
          setHouse(transformedHouse);

          // Convert blocked dates array directly to occupiedDates
          const blocked = response.data.data.availability?.blockedDates || [];
          setOccupiedDates(blocked);
        } else {
          throw new Error(response.data.message || 'Failed to fetch property');
        }
      } catch (err: any) {
        console.error('Failed to fetch property:', err);
        const errorMessage = err?.message || 'Failed to load property';
        setError(errorMessage);
        showAlert(`Error: ${errorMessage}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [validPropertyId]);

  // Update page title dynamically
  useEffect(() => {
    if (house?.title) {
      document.title = `${house.title} - RentSpaces`;
    } else {
      document.title = 'Loading Property - RentSpaces';
    }
  }, [house?.title]);

  // Setup Intersection Observer for video auto-play
  useEffect(() => {
    if (!videoContainerRef.current || !house?.videoUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVideoPlaying) {
            // Video is in view - attempt to play
            if (videoRef.current) {
              const videoSrc = videoRef.current.src;
              // Add autoplay parameter if it's a YouTube video
              if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
                if (!videoSrc.includes('autoplay=1')) {
                  videoRef.current.src = videoSrc + (videoSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1';
                }
              }
              setIsVideoPlaying(true);
            }
          } else if (!entry.isIntersecting && isVideoPlaying) {
            // Video is out of view - pause it
            if (videoRef.current) {
              const videoSrc = videoRef.current.src;
              if (videoSrc.includes('autoplay=1')) {
                videoRef.current.src = videoSrc.replace('autoplay=1&mute=1', '').replace('?&', '?').replace('?', '');
              }
              setIsVideoPlaying(false);
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the video is visible
        rootMargin: '0px'
      }
    );

    observer.observe(videoContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [house?.videoUrl, isVideoPlaying]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      if (!validPropertyId) return;
      
      try {
        setReviewsLoading(true);
        const response = await api.get(`/properties/${validPropertyId}/reviews`);
        
        if (response.data.success) {
          // Transform backend review data to frontend format
          const reviewsData = Array.isArray(response.data.data) ? response.data.data : [];
          const transformedReviews: Review[] = reviewsData.map((review: any) => ({
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
    // Check if the date is in the simple string array
    return occupiedDates.includes(date);
  };

  // Helper function to check if a date range overlaps with occupied dates
  const isRangeOccupied = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check each day in the range
    const currentDate = new Date(start);
    while (currentDate < end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (occupiedDates.includes(dateStr)) {
        return true;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return false;
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

  // Calculate number of nights
  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const days = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return 0;
  };

  // Calculate booking total using display price + 4% tax
  // This is the amount customer pays and what we submit to server
  const calculateTotal = () => {
    if (checkInDate && checkOutDate && house) {
      const days = calculateNights();
      if (days > 0) {
        // Return total with tax: display price (includes hidden 10%) + 4% tax
        const breakdown = calculatePriceBreakdown(house.price, days, false);
        return breakdown.total; // This includes the 4% tax
      }
    }
    return 0;
  };

  // Get price breakdown for checkout (only shows tax)
  const getPriceBreakdown = () => {
    if (checkInDate && checkOutDate && house) {
      const days = calculateNights();
      if (days > 0) {
        return calculatePriceBreakdown(house.price, days, false);
      }
    }
    return null;
  };

  // Scroll to 3D video section
  const scrollToVideo = () => {
    videoContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      // Calculate the total using DISPLAY PRICE (includes 10% markup) for server
      const days = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = calculateTotal(); // Use display price calculation (includes 10% markup)


      // Prepare booking data using the decoded property ID
      const bookingData: CreatePropertyBookingDto = {
        propertyId: parseInt(validPropertyId)!,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guests,
        message: 'Booking request from property page',
        specialRequests: '',
        totalPrice: totalPrice, // Send display price total (includes 10% markup)
      };

      // Make API call to create booking
      api.setAuth(token);
      const response = await api.post('/bookings/properties', bookingData);
      
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
          router.push(`/spaces/${resolvedParams.id}/confirm-and-pay?bookingId=${encodedBookingId}`);
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

  // Map features from API to icons
  const getFeatureIcon = (featureName: string): string => {
    const iconMap: { [key: string]: string } = {
      'wifi': 'bi-wifi',
      'pool': 'bi-water',
      'swimming pool': 'bi-water',
      'gym': 'bi-heart-pulse',
      'parking': 'bi-car-front',
      'security': 'bi-shield-check',
      '24/7 security': 'bi-shield-check',
      'kitchen': 'bi-egg-fried',
      'rooftop': 'bi-building',
      'rooftop terrace': 'bi-building',
      'concierge': 'bi-person-check',
      'tv': 'bi-tv',
      'air conditioning': 'bi-snow2',
      'heating': 'bi-thermometer-sun',
      'workspace': 'bi-laptop',
      'laundry': 'bi-basket3',
      'balcony': 'bi-door-open',
      'garden': 'bi-tree',
      'elevator': 'bi-arrow-up-square',
      'fireplace': 'bi-fire',
      'iron': 'bi-bezier',
      'hair dryer': 'bi-wind',
      'essentials': 'bi-basket',
      'hangers': 'bi-hanger',
      'bed linens': 'bi-moon-stars',
      'towels': 'bi-moisture',
      'hot water': 'bi-droplet-fill',
      'smoke alarm': 'bi-exclamation-triangle',
      'first aid kit': 'bi-bandaid',
      'carbon monoxide alarm': 'bi-cloud-haze2'
    };

    const normalizedFeature = featureName.toLowerCase().trim();
    return iconMap[normalizedFeature] || 'bi-check-circle';
  };

  // Process video URL to ensure it's embeddable
  const getEmbedVideoUrl = (url: string): string => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop()?.split('?')[0] || '';
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    
    // Return original URL if it's already an embed URL or other format
    return url;
  };

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
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="flex gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-24"></div>
              ))}
            </div>
            
            {/* Photo skeleton */}
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

  const priceBreakdown = getPriceBreakdown();
  const nights = calculateNights();

  return (
    <>
      {/* Alert Notification */}
      {alert.show && (
        <AlertNotification
          message={alert.message}
          type={alert.type}
          position="top-right"
          duration={alert.duration}
          onClose={hideAlert}
          showProgress={true}
          autoHide={true}
        />
      )}
      
      <div className="mt-14 bg-white min-h-screen">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-10 py-6">
          
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
          
          {/* Airbnb-style Title Section */}
          <div className="mb-6">
            <h1 className="text-[26px] font-semibold text-gray-900 mb-2">
              {house?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1 text-sm">
              {house?.ratings?.overall > 0 && (
                <>
                  <span className="flex items-center gap-1">
                    <i className="bi bi-star-fill text-xs"></i>
                    <span className="font-medium">{house.ratings.overall}</span>
                  </span>
                  <span className="text-gray-500">·</span>
                  <button className="underline font-medium hover:text-black transition">
                    {house.totalReviews} reviews
                  </button>
                  <span className="text-gray-500">·</span>
                </>
              )}
              <button className="underline font-medium hover:text-black transition">
                {house?.address}
              </button>
            </div>
          </div>

          {/* Airbnb-style Photo Grid */}
          <div className="mb-12">
            {house?.photos && house.photos.length > 0 ? (
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[560px] rounded-xl overflow-hidden">
                {/* Main large image on left */}
                <div 
                  className="col-span-2 row-span-2 relative group cursor-pointer"
                  onClick={() => openPhotoViewer(0)}
                >
                  <img
                    src={house.photos[0] || fallbackImageUrl}
                    alt="Main property view"
                    className="w-full h-full object-cover hover:brightness-95 transition duration-200"
                    onError={handleImageError}
                  />
                </div>

                {/* Four smaller images on right in 2x2 grid */}
                {house.photos.slice(1, 5).map((photo: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="relative group overflow-hidden cursor-pointer"
                    onClick={() => openPhotoViewer(idx + 1)}
                  >
                    <img
                      src={photo || fallbackImageUrl}
                      alt={`Property view ${idx + 2}`}
                      className="w-full h-full object-cover hover:brightness-95 transition duration-200"
                      onError={handleImageError}
                    />
                    {idx === 3 && house.photos.length > 5 && (
                      <div 
                        className="absolute inset-0 bg-black/60 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPhotoViewer(true);
                        }}
                      >
                        <button className="bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition flex items-center gap-2">
                          <i className="bi bi-grid-3x3-gap"></i>
                          Show all photos
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-xl">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <i className="bi bi-image text-5xl"></i>
                  </div>
                  <p className="text-gray-500">No photos available</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Left Content - 3 columns */}
            <div className="lg:col-span-3">
              {/* Property Header */}
              <div className="border-b pb-8 mb-8">
                <h2 className="text-[22px] font-medium mb-1">
                  Entire home hosted by {house?.hostName}
                </h2>
                <div className="flex flex-wrap gap-1 text-base text-gray-700">
                  <span>{house?.guests} guests</span>
                  <span>·</span>
                  <span>{house?.bedrooms} bedrooms</span>
                  <span>·</span>
                  <span>{house?.bedrooms} beds</span>
                  <span>·</span>
                  <span>{house?.bathrooms} baths</span>
                </div>
              </div>

              {/* Property Highlights */}
              <div className="border-b pb-8 mb-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <i className="bi bi-door-open text-2xl"></i>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Self check-in</div>
                    <div className="text-sm text-gray-600">Check yourself in with the lockbox.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <i className="bi bi-sparkles text-2xl"></i>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Enhanced Clean</div>
                    <div className="text-sm text-gray-600">This host committed to enhanced cleaning process.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <i className="bi bi-calendar-x text-2xl"></i>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Free cancellation before check-in</div>
                    <div className="text-sm text-gray-600">Get a full refund if you change your mind.</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-b pb-8 mb-8">
                <div className="text-base leading-relaxed text-gray-800">
                  {house?.description}
                </div>
              </div>

              {/* What this place offers - Features from API */}
              {house?.features && house.features.length > 0 && (
                <div className="border-b pb-8 mb-8">
                  <h3 className="text-[22px] font-medium mb-6">What this place offers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {house.features.slice(0, showAllFeatures ? house.features.length : 8).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <i className={`bi ${getFeatureIcon(feature)} text-xl text-[#083A85]`}></i>
                        <span className="text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {house.features.length > 8 && (
                    <button
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="mt-6 px-6 py-3 border-2 border-[#083A85] text-[#083A85] rounded-lg font-semibold hover:bg-[#083A85] hover:text-white transition-all"
                    >
                      {showAllFeatures ? 'Show less' : `Show all ${house.features.length} features`}
                    </button>
                  )}
                </div>
              )}

              {/* Calendar Section */}
              <div className="border-b pb-8 mb-8">
                <h3 className="text-[22px] font-medium mb-2">{nights > 0 ? `${nights} nights` : 'Select dates'}</h3>
                {checkInDate && checkOutDate && (
                  <p className="text-sm text-gray-600 mb-6">
                    {new Date(checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <CustomDatePicker
                    value={checkInDate}
                    onChange={handleCheckInChange}
                    min={today}
                    occupiedDates={occupiedDates}
                    placeholder="Select check-in date"
                    label="CHECK-IN"
                    disabled={bookingLoading || bookingSuccess}
                  />

                  <CustomDatePicker
                    value={checkOutDate}
                    onChange={handleCheckOutChange}
                    min={checkInDate || today}
                    occupiedDates={occupiedDates}
                    placeholder="Select check-out date"
                    label="CHECKOUT"
                    disabled={bookingLoading || bookingSuccess}
                  />
                </div>
                {dateError && (
                  <div className="mt-4 text-red-600 text-sm flex items-center gap-2">
                    <i className="bi bi-exclamation-circle"></i>
                    {dateError}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Booking Card - 2 columns */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="border rounded-xl p-6 shadow-xl">
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-[22px] font-semibold">${house?.price?.toFixed(2)}</span>
                      <span className="text-gray-600 ml-1">night</span>
                    </div>
                    {house?.ratings?.overall > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <i className="bi bi-star-fill text-xs"></i>
                        <span className="font-medium">{house.ratings.overall}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{house.totalReviews} reviews</span>
                      </div>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div className="mb-4 space-y-2">
                    <CustomDatePicker
                      value={checkInDate}
                      onChange={handleCheckInChange}
                      min={today}
                      occupiedDates={occupiedDates}
                      placeholder="Add date"
                      label="CHECK-IN"
                      disabled={bookingLoading || bookingSuccess}
                    />

                    <CustomDatePicker
                      value={checkOutDate}
                      onChange={handleCheckOutChange}
                      min={checkInDate || today}
                      occupiedDates={occupiedDates}
                      placeholder="Add date"
                      label="CHECKOUT"
                      disabled={bookingLoading || bookingSuccess}
                    />
                  </div>

                  {/* Guests Selection */}
                  <div className="border rounded-lg mb-4">
                    <div className="p-3 relative">
                      <label className="text-[10px] font-semibold uppercase tracking-wide">Guests</label>
                      <div 
                        onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                        className="mt-1 text-sm cursor-pointer flex justify-between items-center"
                      >
                        <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
                        <i className={`bi bi-chevron-${showGuestsDropdown ? 'up' : 'down'}`}></i>
                      </div>
                      {showGuestsDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-4 z-10">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Guests</span>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setGuests(Math.max(1, guests - 1))}
                                disabled={guests <= 1}
                                className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-50"
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="w-8 text-center">{guests}</span>
                              <button 
                                onClick={() => setGuests(Math.min(house?.guests || 8, guests + 1))}
                                disabled={guests >= (house?.guests || 8)}
                                className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-50"
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button
                    onClick={handleReserve}
                    disabled={!checkInDate || !checkOutDate || !!dateError || bookingLoading || bookingSuccess}
                    className={`w-full py-3 rounded-lg font-medium transition mb-3 ${
                      (!checkInDate || !checkOutDate || !!dateError || bookingLoading || bookingSuccess)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#083A85] text-white hover:from-rose-600 hover:to-pink-700'
                    }`}
                  >
                    {bookingLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="bi bi-arrow-clockwise spin"></i>
                        Processing...
                      </span>
                    ) : bookingSuccess ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="bi bi-check-circle-fill"></i>
                        Booking Created!
                      </span>
                    ) : (
                      'Reserve'
                    )}
                  </button>

                  {!checkInDate || !checkOutDate ? (
                    <p className="text-center text-sm text-gray-600">You won't be charged yet</p>
                  ) : (
                    <>
                      <p className="text-center text-sm text-gray-600 mb-4">You won't be charged yet</p>
                      
                      {/* Price Breakdown */}
                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between text-base">
                          <button className="underline">
                            ${house?.price} x {nights} night{nights !== 1 ? 's' : ''}
                          </button>
                          <span>${priceBreakdown?.subtotal.toFixed(2)}</span>
                        </div>
                        {priceBreakdown && (
                          <>
                            <div className="flex justify-between text-base">
                              <button className="underline">Taxes</button>
                              <span>${priceBreakdown.taxes.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        <div className="pt-3 border-t flex justify-between font-medium">
                          <span>Total</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </>
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

                {/* Rare find notice */}
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <i className="bi bi-lightning-charge text-orange-500"></i>
                  <span className="text-gray-700">
                    <span className="font-medium">Rare find.</span> This place is usually booked.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Video Tour Section */}
          {house?.videoUrl && (
            <div ref={videoContainerRef} className="border-t pt-12 mt-12">
              <h2 className="text-[22px] font-medium mb-2">3D Virtual Tour</h2>
              <p className="text-gray-600 mb-6">Take an immersive tour of the property</p>
              
              <div className="relative w-full rounded-xl overflow-hidden bg-gray-100">
                <div className="relative" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */}}>
                  <iframe
                    ref={videoRef}
                    src={getEmbedVideoUrl(house.videoUrl)}
                    className="absolute top-0 left-0 w-full h-full"
                    title="3D Property Tour"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                {/* Play indicator overlay - shown when video is not playing */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                      <i className="bi bi-play-fill text-4xl text-gray-800"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="border-t pt-12 mt-12">
            <div className="flex items-center gap-2 mb-8">
              <i className="bi bi-star-fill text-xl"></i>
              <h2 className="text-[22px] font-medium">
                {house?.ratings?.overall || 0} · {house?.totalReviews || 0} reviews
              </h2>
            </div>


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
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{review.name}</div>
                          <div className="text-sm text-gray-600">{review.date}</div>
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

          {/* Map Section */}
          <div className="border-t pt-12 mt-12">
            <h2 className="text-[22px] font-medium mb-6">Where you'll be</h2>
            <div className="w-full h-[480px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-4">
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
            <div className="mb-8">
              <p className="font-medium mb-2">{house?.address}</p>
              <p className="text-gray-600 leading-relaxed">
                We'll share the exact address after booking confirmation. The property is located in a prime area with easy access to local attractions and amenities.
              </p>
            </div>
          </div>

          {/* Host Section */}
          <div className="border-t pt-12 mt-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                H
              </div>
              <div>
                <h2 className="text-[22px] font-medium mb-1">Hosted by {house?.hostName}</h2>
                <p className="text-sm text-gray-600">Since {house?.createdAt}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <i className="bi bi-star-fill"></i>
                <span>{house?.totalReviews || 0} Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="bi bi-patch-check-fill"></i>
                <span>Identity verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="bi bi-award"></i>
                <span>Superhost</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <p className="mb-6 text-gray-800 leading-relaxed">
                  Hi! I'm your host and I love sharing this beautiful space with guests from around the world. 
                  I'm always available to help make your stay comfortable and memorable.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <span className="font-medium">Response rate: </span>
                    <span>100%</span>
                  </div>
                  <div>
                    <span className="font-medium">Response time: </span>
                    <span>Within an hour</span>
                  </div>
                </div>

                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">
                  Contact Host
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
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

          {/* Things to know */}
          <div className="border-t pt-12 mt-12 mb-12">
            <h2 className="text-[22px] font-medium mb-8">Things to know</h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3 className="font-medium mb-4">House rules</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Check-in: 3:00 PM - 10:00 PM</p>
                  <p>Checkout before 11:00 AM</p>
                  <p>{house?.guests} guests maximum</p>
                  <p>No smoking</p>
                  <p>No pets</p>
                  <p>No parties or events</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Safety & property</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Smoke alarm</p>
                  <p>Carbon monoxide alarm</p>
                  <p>First aid kit</p>
                  <p>Fire extinguisher</p>
                  <p>Lock on bedroom door</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Cancellation policy</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Free cancellation before 24 hours of check-in.</p>
                  <p>After that, cancel before check-in and get a 50% refund, minus the service fee.</p>
                  <button className="font-medium underline">Show more</button>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Viewer Modal */}
          <PhotoViewerModal
            isOpen={showPhotoViewer}
            onClose={() => setShowPhotoViewer(false)}
            photos={house?.photos || []}
            initialPhotoIndex={selectedPhotoIndex}
            propertyTitle={house?.title || 'Property Photos'}
            propertyImages={validPropertyId ? backendProperty?.images : undefined}
          />

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