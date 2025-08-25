'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";

// Define the type for a single review, now with a profile image
interface Review {
  name: string;
  date: string;
  comment: string;
  rating: number;
  profileImage: string;
}

// Define the type for the mock tour data
interface TourData {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  availableDates: string[];
  maxGuests: number;
  isLikelyToSellOut: boolean;
  freeCancellation: boolean;
  reserveNowPayLater: boolean;
  description: string;
  whatsIncluded: string[];
  whatsExcluded: string[];
  additionalInfo: {
    confirmation: string;
    accessibility: string;
    groupSize: string;
    duration: string;
  };
  reviews: Review[];
  images: string[];
}

// Mock tour data with online images and updated reviews
const mockTour: TourData = {
  id: '1',
  title: 'Karisimbi Volcano Climbing Tour',
  location: 'Rwanda, Musanze(North province)',
  rating: 3.8,
  reviewsCount: 181,
  pricePerPerson: 67,
  availableDates: ['2025-09-01', '2025-09-05', '2025-09-10'],
  maxGuests: 20,
  isLikelyToSellOut: true,
  freeCancellation: true,
  reserveNowPayLater: true,
  description: `Embark on a 2-day adventure to conquer Mount Karisimbi (4,507m), Rwanda's highest volcano. 
  Trek through diverse landscapes, camp under the stars, and summit at sunrise for sweeping views of the 
  Virunga Mountains an unforgettable challenge for adventurous explorers.`,
whatsIncluded: [
  'Karisimbi hiking permit and park fees',
  'Professional guide and park ranger',
  'Overnight camping at 3,700m i.e:tent provided if arranged',
  'Packed meals during the hike i.e:lunch, dinner, breakfast',
  'Drinking water during the trek',
  'Hotel pickup and drop-off i.e:if selected',
],

whatsExcluded: [
  'Sleeping bag and personal camping gear available for rent',
  'Porter services optional, ~$20/day',
  'Food and drinks not specified in the itinerary',
  'Any personal expenses',
  'Tips and gratuities',
],

  additionalInfo: {
    confirmation: 'Confirmation will be received at time of booking',
    accessibility: 'Wheelchair accessible',
    groupSize: 'Maximum of 200 travelers',
    duration: 'Full-day experience'
  },
  reviews: [
    { name: 'Richard_D', date: 'Jul 2025', comment: 'Great tour, everything was perfect and the guide was fantastic!', rating: 5, profileImage: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Karen_E', date: 'Jul 2025', comment: 'The caves were beautiful but the boat was a little crowded.', rating: 3, profileImage: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Sophia, USA', date: 'Jul 2025', comment: 'An unforgettable experience! The Blue Caves were breathtaking, and Gaios village was charming.', rating: 5, profileImage: 'https://randomuser.me/api/portraits/women/61.jpg' },
    { name: 'Luca, Italy', date: 'Jun 2025', comment: 'Well-organized and beautiful scenery throughout the day. A must-do when in Corfu.', rating: 4, profileImage: 'https://randomuser.me/api/portraits/men/50.jpg' },
  ],
  images: [
  'https://www.insidevolcanoesnationalpark.com/wp-content/uploads/2020/08/mount-karisimbi-in-rwanda.jpg',
  'https://www.jungleescapeafrica.com/wp-content/uploads/2022/05/hiking-mount-karisimbi.jpg',
  'https://media.istockphoto.com/id/1702890955/photo/view-of-some-scattered-clouds-floating-in-the-morning.jpg?s=612x612&w=0&k=20&c=7tiZuoXWSQoD3duuOCkRb3bnGbpkYb3JAwTz4_qNK0M=',
  'https://www.volcanoesnationalparkruhengeri.com/wp-content/uploads/2024/02/Mount-Karisimbi-Volcano-Hike-Rwanda-Gorilla-Safaris.jpg',
  'https://media.istockphoto.com/id/500018821/photo/virunga-volcanoes-around-mudende-mugongo-rwanda-central-africa.jpg?s=612x612&w=0&k=20&c=sS39oqwoxWambbv2_qA9e7ZjJI9ZJn7ROnV7E-lyVj8=',
  'https://media.istockphoto.com/id/1443251251/photo/cloud-is-passing-through-mount-karisimbi-as-viewed-from-ground-level-in-busogo.jpg?s=612x612&w=0&k=20&c=wBRlv3-dx4WL4-xWnrjRQZgoLwmBnKeY09YAKEMW6uM=',
  'https://i.pinimg.com/736x/42/b2/54/42b2542a482f305a203da8a3c2a7b13f.jpg',
  'https://i.pinimg.com/736x/e7/e0/51/e7e051211a1fa6ed3ffd34e1a0e38f9c.jpg',
  'https://media.istockphoto.com/id/1473765066/photo/aerial-view-of-mount-sindoro-in-indonesia-with-noise-cloud.jpg?s=612x612&w=0&k=20&c=LILT5rx2MRK9IQcLK5vG215kdJq2FZZxdQT6M7tn3jA=',
  'https://media.istockphoto.com/id/2158820389/photo/mountain-peaks-of-volcanoes-national-park.jpg?s=612x612&w=0&k=20&c=Po6OgpFIzQacFufG22ICE4b5wscwFU-mnB748TVt0kc=',
  'https://i.pinimg.com/736x/a8/f5/5c/a8f55c832850f806fdd0a166750e89df.jpg',
  'https://media.istockphoto.com/id/2165073243/photo/scenic-view-of-landscape-against-sky.jpg?s=612x612&w=0&k=20&c=NgLjeEUkG04ds0iltxahno4u1GsS6BVXJs3yL2Z0uls=',
  'https://media.istockphoto.com/id/969587170/photo/agua-volcano-sunrise-in-guatemala-golf-club-la-reunion-3-760-m-central-america-nature-reserve.jpg?s=612x612&w=0&k=20&c=Dz-FO3UTc5R0vkopXbSDYTHAFoMk3jG-_LjCLsF6z8U=',
  'https://i.pinimg.com/736x/97/58/ed/9758ed4f9f849151b6314baf92a012a4.jpg'
]

};

// Use existing Tour interface
interface Tour {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  image: string;
  isBestseller?: boolean;
  category: string;
}

// Mock data for promoted experiences section (using existing Tour interface)
const promotedTours: Tour[] = [
  {
    id: '2',
    title: 'Nyungwe Forest National Park',
    location: 'Rwanda, Rusizi(Western Province)',
    rating: 4.8,
    reviews: 758,
    duration: '10 hours',
    price: 72,
    image: 'https://i.pinimg.com/1200x/48/40/65/484065febd36354e52e71a6046c170d2.jpg',
    category: 'National Parks',
  },
  {
    id: '3',
    title: 'Mount Bisokei Volcano Climbing Tour',
    location: 'Rwanda, Musanze(North Province)',
    rating: 4.6,
    reviews: 1581,
    duration: '10 hours',
    price: 84,
    image: 'https://i.pinimg.com/736x/8e/08/ed/8e08ed98ebf21b0a1cb54520329a7f7e.jpg',
    category: 'Mountains',
  },
  {
    id: '4',
    title: 'Corfu Panoramic Island Tour',
    location: 'Corfu, Greece',
    rating: 4.3,
    reviews: 77,
    duration: '4 to 5 hours',
    price: 59,
    image: 'https://dynamic-media.tacdn.com/media/photo-o/2e/e7/3d/74/caption.jpg?w=800&h=600&s=1',
    category: 'Private Sightseeing',
  },
  {
    id: '5',
    title: 'Lake Kivu Boat Cruise',
    location: 'Rwanda, Rubavu(Western Province)',
    rating: 4.5,
    reviews: 931,
    duration: '6 hours',
    price: 45,
    image: 'https://i.pinimg.com/736x/4f/17/5c/4f175cd4e1b5e639080a22f8a4dab463.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '6',
    title: 'Old Town Historic Walking Tour',
    location: 'Corfu, Greece',
    rating: 4.9,
    reviews: 644,
    duration: '3 hours',
    price: 35,
    image: 'https://dynamic-media.tacdn.com/media/photo-o/2e/e7/38/99/caption.jpg?w=800&h=600&s=1',
    isBestseller: true,
    category: 'Walking Tours',
  },
  {
    id: '7',
    title: 'Mount Nyiragongo Volcano Climbing Tour',
    location: 'Rwanda,Rubavu(wesrern Province)',
    rating: 4.7,
    reviews: 512,
    duration: '4 hours',
    price: 120,
    image: 'https://i.pinimg.com/1200x/b5/e3/75/b5e3754f36e9b3fdc1be55efaf22d31a.jpg',
    category: 'Mountains',
  },
  {
    id: '8',
    title: 'Akagera National Park Safari Tour',
    location: 'Rwanda, Kayonza(Eastern Province)',
    rating: 4.6,
    reviews: 389,
    duration: '8 hours',
    price: 150,
    image: 'https://i.pinimg.com/736x/b8/3f/02/b83f0269a8b77d41c0a93e179f9861b4.jpg',
    category: 'National Parks',
  },
  {
    id: '9',
    title: 'Twin Lakes Burera & Ruhondo Boat Tour',
    location: 'Rwanda, Musanze(North Province)',
    rating: 4.8,
    reviews: 234,
    duration: '4 hours',
    price: 95,
    image: 'https://i.pinimg.com/1200x/d4/9a/e4/d49ae4213d0960c7b55f1baf2ca0a7d6.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '10',
    title: 'Monastery & Villages Tour',
    location: 'Corfu, Greece',
    rating: 4.4,
    reviews: 156,
    duration: '6 hours',
    price: 68,
    image: 'data:image/jpeg;base64,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',
    category: 'Private Sightseeing',
  },
  {
    id: '11',
    title: 'Mount Kigalia Hiking Tour',
    location: 'Rwanda,Nyarugenge(Kigali)',
    rating: 4.7,
    reviews: 445,
    duration: '7 hours',
    price: 135,
    image: 'https://i.pinimg.com/736x/e9/cb/60/e9cb6010a52f13443265fac0ea630f14.jpg',
    category: 'Mountains',
  },
  {
    id: '12',
    title: 'Olive Oil Tasting Tour',
    location: 'Corfu, Greece',
    rating: 4.5,
    reviews: 89,
    duration: '3 hours',
    price: 42,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4KzvpF7AaDBndtPUO6JcGt08j6VrZRFTN8A&s',
    category: 'Walking Tours',
  },
  {
    id: '13',
    title: 'Mukungwa River Cruise',
    location: 'Rwanda, Musanze(Northern Province)',
    rating: 4.6,
    reviews: 267,
    duration: '5 hours',
    price: 78,
    image: 'https://i.pinimg.com/736x/7a/6f/3f/7a6f3f66d9b7f2c482a297f11d5ba5eb.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '14',
    title: 'Ancient Ruins Exploration',
    location: 'Corfu, Greece',
    rating: 4.3,
    reviews: 134,
    duration: '4 hours',
    price: 56,
    image: 'data:image/jpeg;base64,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',
    category: 'Walking Tours',
  },
  {
    id: '15',
    title: 'Gishwati-Mukura National Park Tour',
    location: 'Rwanda,Gicumbi(North province)',
    rating: 4.4,
    reviews: 98,
    duration: '6 hours',
    price: 110,
    image: 'https://i.pinimg.com/1200x/e7/92/b9/e792b9af1937af3d9d14739cac3acf74.jpg',
    category: 'National Parks',
  },
  {
    id: '16',
    title: 'Lake Muhazi',
    location: 'Rwanda,Rwamagana(Eastern Province)',
    rating: 4.8,
    reviews: 356,
    duration: '2 hours',
    price: 89,
    image: 'https://i.pinimg.com/736x/cf/dc/16/cfdc1608fec931f0d0ec59729bb26bdc.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '17',
    title: 'Wine Country Tour',
    location: 'Corfu, Greece',
    rating: 4.6,
    reviews: 178,
    duration: '5 hours',
    price: 85,
    image: 'https://pictures.altai-travel.com/1920x0/kandoo-guide-kayaking-in-the-lofoten-islands-lamb-carl-3259.jpg',
    category: 'Private Sightseeing',
  },
  {
    id: '18',
    title: 'Helicopter Island Tour',
    location: 'Corfu, Greece',
    rating: 4.9,
    reviews: 67,
    duration: '1 hour',
    price: 350,
    image: 'data:image/jpeg;base64,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',
    isBestseller: true,
    category: 'Private Sightseeing',
  },
  {
    id: '19',
    title: 'Lake Burera Hot Springs Tour',
    location: 'Rwanda,Burera(North province)',
    rating: 4.5,
    reviews: 299,
    duration: '4 hours',
    price: 65,
    image: 'https://i.pinimg.com/1200x/f3/91/9a/f3919aa9752e2b733cda13814c831b69.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '20',
    title: 'Traditional Greek Cooking Class',
    location: 'Corfu, Greece',
    rating: 4.7,
    reviews: 145,
    duration: '4 hours',
    price: 75,
    image: 'https://i.pinimg.com/1200x/75/81/8f/75818f6a61b87aff35bd1b91721b44a8.jpg',
    category: 'Walking Tours',
  },
  {
    id: '21',
    title: 'Rugezi Marshes National Park Tour',
    location: 'Rwanda,Burera(North province)',
    rating: 4.4,
    reviews: 223,
    duration: '8 hours',
    price: 92,
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Rugezi_wetland_%28cropped%29.jpg',
    category: 'National Parks',
  },
  {
    id: '22',
    title: 'Archaeological Walking Tour',
    location: 'Corfu, Greece',
    rating: 4.2,
    reviews: 87,
    duration: '3 hours',
    price: 38,
    image: 'https://visitrwanda.com/wp-content/uploads/fly-images/1641/Visit-Rwanda-Volcano-1920x1280.jpg',
    category: 'Walking Tours',
  },
  {
    id: '23',
    title: 'Lake Mugesera Boat Cruise',
    location: 'Rwanda,Bugesera(Eastern province)',
    rating: 4.6,
    reviews: 412,
    duration: '2 hours',
    price: 125,
    image: 'https://i.pinimg.com/1200x/56/75/22/5675224473b556e112c23bbb4f60de85.jpg',
    category: 'Lakes & Rivers',
  },
  {
    id: '24',
    title: 'Mountain Hiking Expedition',
    location: 'Corfu, Greece',
    rating: 4.5,
    reviews: 156,
    duration: '6 hours',
    price: 58,
    image: 'https://www.tailormadeafrica.com/wp-content/uploads/Akagera-National-Park-1.jpeg',
    category: 'Private Sightseeing',
  },
];

// Helper function to render star ratings
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<i key={i} className="bi bi-star-fill text-[#F20C8F]"></i>);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<i key={i} className="bi bi-star-half text-[#F20C8F]"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star text-gray-300"></i>);
    }
  }
  return <div className="flex gap-1">{stars}</div>;
};

// Define a type for the counts object to allow numeric keys
type RatingCounts = {
  [key: number]: number;
};

// Helper function to calculate review stats, now with explicit types
const getReviewStats = (reviews: Review[]) => {
  const counts: RatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;

  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      counts[Math.floor(review.rating)]++;
      totalRating += review.rating;
    }
  });

  const total = reviews.length;
  const average = total > 0 ? (totalRating / total).toFixed(1) : '0.0';

  return { average, total, counts };
};

const SingleTourPage = () => {
  const [mainImage, setMainImage] = useState(mockTour.images[0]);
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(mockTour.availableDates[0]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState(false);
  const [sortOption, setSortOption] = useState('most_recent');
  const [currentPromotedIndex, setCurrentPromotedIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  const reviewStats = getReviewStats(mockTour.reviews);

  // Update items per slide based on window size
  const updateItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(3); // lg screens
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(2); // md screens
      } else {
        setItemsPerSlide(1); // sm screens
      }
    }
  };

  const maxSlides = Math.ceil(promotedTours.length / itemsPerSlide);

  // Carousel navigation functions
  const goToNextPromoted = () => {
    setCurrentPromotedIndex((prevIndex) => {
      const maxIndex = promotedTours.length - itemsPerSlide;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const goToPreviousPromoted = () => {
    setCurrentPromotedIndex((prevIndex) => {
      const maxIndex = promotedTours.length - itemsPerSlide;
      return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };

  // Handle window resize for responsive carousel
  useEffect(() => {
    // Set initial items per slide
    updateItemsPerSlide();

    const handleResize = () => {
      updateItemsPerSlide();
      // Reset carousel position on screen size change
      setCurrentPromotedIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to navigate image gallery
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mockTour.images.length);
    setMainImage(mockTour.images[(currentImageIndex + 1) % mockTour.images.length]);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + mockTour.images.length) % mockTour.images.length);
    setMainImage(mockTour.images[(currentImageIndex - 1 + mockTour.images.length) % mockTour.images.length]);
  };

  // Generate calendar data for the next 3 months
  const generateCalendarData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const currentMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
      const firstDayOfWeek = currentMonth.getDay();
      
      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let j = 0; j < firstDayOfWeek; j++) {
        days.push(null);
      }
      
      // Add all days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isAvailable = Math.random() > 0.3; // Random availability
        const price = mockTour.pricePerPerson + Math.floor(Math.random() * 20) - 10; // Price variation
        
        days.push({
          day,
          date: dateString,
          isAvailable,
          price,
          isPast: new Date(dateString) < today
        });
      }
      
      months.push({
        name: currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        days
      });
    }
    
    return months;
  };

  const calendarData = generateCalendarData();

  // Time slots with different pricing
  const timeSlots = [
    { id: '1', time: '8:00 AM', duration: '8 hours', price: mockTour.pricePerPerson, available: true, popular: true },
    { id: '2', time: '9:30 AM', duration: '8 hours', price: mockTour.pricePerPerson + 5, available: true, popular: false },
    { id: '3', time: '11:00 AM', duration: '7 hours', price: mockTour.pricePerPerson - 5, available: false, popular: false },
    { id: '4', time: '2:00 PM', duration: '6 hours', price: mockTour.pricePerPerson + 10, available: true, popular: false },
  ];

  // Logic for sorting reviews
  const sortedReviews = [...mockTour.reviews].sort((a, b) => {
    if (sortOption === 'highest_rating') {
      return b.rating - a.rating;
    } else if (sortOption === 'lowest_rating') {
      return a.rating - b.rating;
    } else {
      // Most recent (default) - assuming a new review is added at the end
      return 0;
    }
  });

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing tour: ${mockTour.title}`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
    }
    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  return (
    <div className="mt-14 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#083A85] mb-3 sm:mb-4 leading-tight">{mockTour.title}</h1>
          <div className="flex items-center text-sm sm:text-base mb-2">
            {renderStars(mockTour.rating)}
            <span className="ml-2 font-semibold text-gray-900">{mockTour.rating}</span>
            <span className="mx-1.5 text-gray-400">•</span>
            <span className="text-[#F20C8F] font-medium hover:underline cursor-pointer">{mockTour.reviewsCount} reviews</span>
          </div>
          <p className="text-gray-700 text-sm sm:text-base flex items-center">
            <i className="bi bi-geo-alt-fill text-[#F20C8F] mr-1"></i>
            {mockTour.location}
          </p>
        </div>

        {/* Image Gallery with Left Thumbnails */}
        <div className="mb-8 sm:mb-12 relative">
          <div className="flex gap-2 h-[400px] sm:h-[500px] rounded-xl overflow-hidden">
            
            {/* Left Thumbnail Column */}
            <div className="hidden sm:flex flex-col gap-2 w-24 lg:w-32">
              {mockTour.images.slice(0, 5).map((image, idx) => (
                <div
                  key={idx}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                    idx === currentImageIndex ? 'ring-2 ring-[#F20C8F] ring-offset-2' : 'hover:opacity-80'
                  }`}
                  style={{ height: idx === 0 ? '40%' : '15%' }}
                  onClick={() => {
                    setMainImage(image);
                    setCurrentImageIndex(idx);
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 4 && mockTour.images.length > 5 && (
                    <div
                    className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm cursor-pointer bg-cover bg-center"
                    style={{ backgroundImage: "url('https://i.pinimg.com/736x/a8/f5/5c/a8f55c832850f806fdd0a166750e89df.jpg')" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPhotoGalleryModal(true);
                    }}
                  >
                    See More
                  </div>

                  )}
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative rounded-xl overflow-hidden group">
              <img
                src={mainImage}
                alt="Main tour image"
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <i className="bi bi-chevron-left text-lg"></i>
              </button>
              
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <i className="bi bi-chevron-right text-lg"></i>
              </button>

              {/* Share and Wishlist buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-all duration-200 text-sm font-medium cursor-pointer"
                  onClick={() => setShowShareModal(true)}
                >
                  <i className="bi bi-share-fill"></i> Share
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg transition-all duration-200 text-sm font-medium ${
                    isWishlisted ? 'text-red-500' : 'text-gray-700 hover:bg-white cursor-pointer'
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  {isWishlisted ? 'Saved' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile view: Single image with dots */}
          <div className="block sm:hidden">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={mainImage}
                alt="Main tour image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {mockTour.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMainImage(mockTour.images[idx]);
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-all duration-200 text-sm font-medium"
                  onClick={() => setShowShareModal(true)}
                >
                  <i className="bi bi-share-fill"></i> Share
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-lg transition-all duration-200 text-sm font-medium ${
                    isWishlisted ? 'text-red-500' : 'text-gray-700 hover:bg-white'
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  {isWishlisted ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Promoted Experiences Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85]">Explore our promoted experiences</h2>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousPromoted}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#F20C8F] hover:text-[#F20C8F] transition-all duration-200"
              >
                <i className="bi bi-chevron-left text-lg"></i>
              </button>
              <button
                onClick={goToNextPromoted}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#F20C8F] hover:text-[#F20C8F] transition-all duration-200"
              >
                <i className="bi bi-chevron-right text-lg"></i>
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentPromotedIndex * (100 / itemsPerSlide)}%)`,
              }}
            >
              {promotedTours.map((tour) => (
                <div 
                  key={tour.id} 
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex-shrink-0 mr-4"
                  style={{ width: `calc(${100 / itemsPerSlide}% - 1rem)` }}
                >
                  <div className="relative">
                    <img src={tour.image} alt={tour.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    {tour.isBestseller && (
                      <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                        Bestseller
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-all duration-200">
                       <i className="bi bi-heart text-gray-700"></i>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <i className="bi bi-globe text-[#083A85]"></i>
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{tour.category}</span>
                      <span className="text-gray-600">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(tour.rating)}
                      <span className="font-semibold text-gray-900 text-sm">{tour.rating}</span>
                      <span className="text-gray-500 text-xs">({tour.reviews})</span>
                    </div>
                    <h3 className="text-md font-bold text-[#083A85] mb-1 line-clamp-2">{tour.title}</h3>
                    <div className="mt-2 text-gray-600">
                      <span className="font-bold text-lg text-[#F20C8F]">${tour.price}</span>
                      <span className="text-xs"> per group</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: maxSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromotedIndex(index * itemsPerSlide)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  Math.floor(currentPromotedIndex / itemsPerSlide) === index
                    ? 'bg-[#F20C8F] w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1">

            {/* Overview Section */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">About This Tour</h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-6">{mockTour.description}</p>
              
              {/* Tour Highlights */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#083A85] mb-3">Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-lg text-green-500 mt-0.5"></i>
                    <span>Explore the stunning Blue Caves of Paxoi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-lg text-green-500 mt-0.5"></i>
                    <span>Swim at pristine Voutoumi Beach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-lg text-green-500 mt-0.5"></i>
                    <span>Visit the charming village of Gaios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bi bi-check-lg text-green-500 mt-0.5"></i>
                    <span>Professional tour escort included</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                  <h3 className="font-bold text-md mb-2 text-green-800 flex items-center">
                    <i className="bi bi-check-circle-fill mr-2"></i> What's Included
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {mockTour.whatsIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                  <h3 className="font-bold text-md mb-2 text-red-800 flex items-center">
                    <i className="bi bi-x-circle-fill mr-2"></i> What's Not Included
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {mockTour.whatsExcluded.map((item, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <span className="text-red-500 mr-2 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Itinerary Section */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Detailed Itinerary</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-[#F20C8F] pl-4">
                  <h3 className="font-semibold text-[#083A85] mb-1">8:00 AM - Departure</h3>
                  <p className="text-gray-700 text-sm">Meet at Corfu Port and board our comfortable cruise boat</p>
                </div>
                <div className="border-l-4 border-[#F20C8F] pl-4">
                  <h3 className="font-semibold text-[#083A85] mb-1">9:30 AM - Blue Caves Exploration</h3>
                  <p className="text-gray-700 text-sm">Navigate through the famous Blue Caves with stunning rock formations</p>
                </div>
                <div className="border-l-4 border-[#F20C8F] pl-4">
                  <h3 className="font-semibold text-[#083A85] mb-1">11:00 AM - Antipaxoi Beach</h3>
                  <p className="text-gray-700 text-sm">Free time to swim and relax at beautiful Voutoumi Beach</p>
                </div>
                <div className="border-l-4 border-[#F20C8F] pl-4">
                  <h3 className="font-semibold text-[#083A85] mb-1">1:00 PM - Gaios Village</h3>
                  <p className="text-gray-700 text-sm">Explore the charming harbor town and enjoy lunch (own expense)</p>
                </div>
                <div className="border-l-4 border-[#F20C8F] pl-4">
                  <h3 className="font-semibold text-[#083A85] mb-1">4:00 PM - Return Journey</h3>
                  <p className="text-gray-700 text-sm">Scenic cruise back to Corfu with onboard refreshments available</p>
                </div>
              </div>
            </div>

            {/* Meeting Point & Important Information */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Meeting Point & Important Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#083A85] mb-2 flex items-center">
                    <i className="bi bi-geo-alt-fill text-[#F20C8F] mr-2"></i>Meeting Point
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Volcanoes National Park HQ, Kinigi<br/>
                    Musanze District, Northern Province, Rwanda<br/>
                    Look for your guide with a Karisimbi Trek sign
                  </p>
                  
                  <h3 className="font-semibold text-[#083A85] mb-2 flex items-center">
                    <i className="bi bi-clock text-[#F20C8F] mr-2"></i>Schedule
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Duration: 8 hours</li>
                    <li>• Start time: 8:00 AM</li>
                    <li>• Return time: 4:00 PM</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#083A85] mb-2 flex items-center">
                    <i className="bi bi-exclamation-triangle text-[#F20C8F] mr-2"></i>Important Notes
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700 mb-4">
                    <li>• Bring swimwear and towel</li>
                    <li>• Sunscreen and hat recommended</li>
                    <li>• Comfortable walking shoes</li>
                    <li>• Camera for photos</li>
                    <li>• Cash for personal expenses</li>
                  </ul>

                  <h3 className="font-semibold text-[#083A85] mb-2 flex items-center">
                    <i className="bi bi-info-circle text-[#F20C8F] mr-2"></i>Additional Info
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Languages: English, Greek</li>
                    <li>• Group size: Maximum 200 travelers</li>
                    <li>• Weather dependent</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Cancellation Policy</h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <i className="bi bi-check-circle-fill text-green-500 text-2xl mb-2 block"></i>
                    <h3 className="font-semibold text-green-700 mb-1">Free Cancellation</h3>
                    <p className="text-gray-600">Cancel up to 24 hours before the experience starts for a full refund</p>
                  </div>
                  <div className="text-center">
                    <i className="bi bi-clock-fill text-blue-500 text-2xl mb-2 block"></i>
                    <h3 className="font-semibold text-blue-700 mb-1">Flexible Booking</h3>
                    <p className="text-gray-600">Reserve now and pay later to lock in your spot</p>
                  </div>
                  <div className="text-center">
                    <i className="bi bi-cloud-rain-fill text-gray-500 text-2xl mb-2 block"></i>
                    <h3 className="font-semibold text-gray-700 mb-1">Weather Policy</h3>
                    <p className="text-gray-600">Full refund if canceled due to poor weather conditions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-[#083A85] mb-2">Is this tour suitable for children?</h3>
                  <p className="text-gray-700 text-sm">Yes, this tour is family-friendly. Children must be accompanied by an adult. Life jackets are provided for safety.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-[#083A85] mb-2">What happens if the weather is bad?</h3>
                  <p className="text-gray-700 text-sm">Tours may be canceled due to unsafe weather conditions. In this case, you'll receive a full refund or the option to reschedule.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-[#083A85] mb-2">Are meals included?</h3>
                  <p className="text-gray-700 text-sm">Meals are not included, but there will be time for lunch in Gaios village where you can choose from local tavernas.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-[#083A85] mb-2">Is the boat wheelchair accessible?</h3>
                  <p className="text-gray-700 text-sm">The boat has limited wheelchair accessibility. Please contact us in advance to discuss specific requirements.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#083A85] mb-2">Can I bring my own food and drinks?</h3>
                  <p className="text-gray-700 text-sm">Yes, you're welcome to bring snacks and non-alcoholic beverages. Alcoholic beverages are available for purchase onboard.</p>
                </div>
              </div>
            </div>

            {/* Location & Map Section */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Location</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#083A85] mb-2">Meeting Point Details</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-start gap-2">
                      <i className="bi bi-geo-alt-fill text-[#F20C8F] mt-0.5"></i>
                      <span>Corfu New Port, Ethnikis Antistaseos, 491 00 Corfu, Greece</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <i className="bi bi-clock text-[#F20C8F] mt-0.5"></i>
                      <span>Please arrive 15 minutes before departure time</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <i className="bi bi-info-circle text-[#F20C8F] mt-0.5"></i>
                      <span>Look for the blue Viator flag and our representative</span>
                    </p>
                  </div>
                  
                 <h3 className="font-semibold text-[#083A85] mb-2 mt-4">Nearby Landmarks</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• 5 km from Volcanoes National Park HQ, Kinigi</li>
                    <li>• 7 km from Musanze town center</li>
                    <li>• 10 km from Twin Lakes Burera & Ruhondo</li>
                    <li>• 15 km from Iby’iwacu Cultural Village</li>
                    <li>• 20 km from Golden Monkey habitat</li>
                    <li>• 25 km from Dian Fossey Karisoke Research Center</li>
                    <li>• 50 km from Lake Kivu (Gisenyi border area)</li>
                    <li>• 110 km from Kigali International Airport</li>
                  </ul>

                </div>
                
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <i className="bi bi-map text-4xl mb-2"></i>
                    <p className="font-medium">Interactive Map</p>
                    <p className="text-sm">Volcanoes National Park HQ, Kinigi, Musanze, Rwanda</p>
                    <p className="text-xs mt-2">Coordinates: 1.5036° S, 29.6363° E</p>

                  </div>
                </div>
              </div>
            </div>

            {/* Safety & Health Measures */}
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4">Safety & Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#083A85] mb-3 flex items-center">
                    <i className="bi bi-shield-check text-green-500 mr-2"></i>Safety Measures
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <i className="bi bi-check text-green-500 mt-0.5"></i>
                      <span>Life jackets provided for all passengers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bi bi-check text-green-500 mt-0.5"></i>
                      <span>Experienced captain and crew</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bi bi-check text-green-500 mt-0.5"></i>
                      <span>Safety briefing before departure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bi bi-check text-green-500 mt-0.5"></i>
                      <span>First aid kit onboard</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#083A85] mb-3 flex items-center">
                    <i className="bi bi-heart-pulse text-red-500 mr-2"></i>Health Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <i className="bi bi-exclamation-triangle text-yellow-500 mt-0.5"></i>
                      <span>Not recommended for travelers with back problems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bi bi-exclamation-triangle text-yellow-500 mt-0.5"></i>
                      <span>Not recommended for pregnant travelers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bi bi-info-circle text-blue-500 mt-0.5"></i>
                      <span>Moderate physical fitness level required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="bi bi-info-circle text-blue-500 mt-0.5"></i>
                      <span>Swimming ability recommended but not required</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Traveler Photos Section */}
            <div className="mb-8 sm:mb-12 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-6">Traveler Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {mockTour.images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden shadow-md group">
                    <img src={img} alt={`Traveler photo ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  </div>
                ))}
                <button
                className="relative aspect-square rounded-lg overflow-hidden shadow-md bg-cover bg-center flex items-center justify-center text-white font-medium transition-all duration-300 group cursor-pointer hover:opacity-90"
                style={{ backgroundImage: "url('https://media.istockphoto.com/id/1367416810/photo/aerial-view-from-high-altitude-of-little-planet-earth-at-sunrise-covered-with-evergreen.jpg?s=612x612&w=0&k=20&c=lhfd9jiubIrq8wS1wvHeKf_JYTcG268_FC9CXapZuJA=')" }}
                onClick={() => setShowPhotoGalleryModal(true)}
              >
                <div className="relative flex flex-col items-center">
                  <span className="text-sm font-semibold">See more</span>
                  <i className="bi bi-arrow-right mt-1"></i>
                </div>
              </button>

              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#083A85] mb-4 sm:mb-6">Guest Ratings & Reviews</h2>
                
                {/* Overall Rating */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="text-center sm:text-left">
                            <span className="text-4xl sm:text-5xl font-bold text-[#083A85]">{reviewStats.average}</span>
                            <div className="flex gap-1 mt-2 justify-center sm:justify-start">
                                {renderStars(parseFloat(reviewStats.average))}
                            </div>
                            <p className="text-gray-600 font-medium mt-1 text-sm sm:text-base">{reviewStats.total} reviews</p>
                        </div>
                        
                        {/* Rating Distribution */}
                        <div className="flex-1 w-full">
                            {Object.entries(reviewStats.counts).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([stars, count]) => (
                                <div key={stars} className="flex items-center gap-2 sm:gap-3 mb-2">
                                    <span className="w-4 text-sm font-medium">{stars}</span>
                                    <i className="bi bi-star-fill text-[#F20C8F] text-sm"></i>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                                        <div
                                            className="bg-[#F20C8F] h-2 sm:h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${(count / reviewStats.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-600 w-8 sm:w-12 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews Summary */}
                <div className="border-t pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#083A85]">Guest Reviews</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F20C8F]/50 focus:border-[#F20C8F] transition-all duration-200 text-sm sm:text-base"
                            />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F20C8F]/50 focus:border-[#F20C8F] transition-all duration-200 bg-white text-sm sm:text-base"
                            >
                                <option value="most_recent">Sort by: Most recent</option>
                                <option value="highest_rating">Sort by: Highest rating</option>
                                <option value="lowest_rating">Sort by: Lowest rating</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        {sortedReviews.map((review, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                                        <img src={review.profileImage} alt={`${review.name}'s profile`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3">
                                            <div>
                                                <p className="font-semibold text-[#083A85] text-sm sm:text-base">{review.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-500">{review.date}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`bi bi-star-fill text-sm ${i < review.rating ? 'text-[#F20C8F]' : 'text-gray-300'}`}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* Booking Form Sidebar */}
          <div className="lg:w-[350px] sticky top-8 h-fit">
            <div className="border-2 border-[#083A85] rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-baseline mb-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-[#F20C8F]">${mockTour.pricePerPerson}</h3>
                  <span className="text-gray-600">per person</span>
                </div>
              </div>
              
              {/* Price breakdown */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs">
                <p className="text-gray-600">Price varies by group size</p>
                <p className="text-gray-600">From ${mockTour.pricePerPerson} per adult (age 13+)</p>
                <p className="text-gray-600">Children (4-12): ${Math.round(mockTour.pricePerPerson * 0.8)}</p>
                <p className="text-gray-600">Infants (0-3): Free</p>
              </div>
              
              {mockTour.isLikelyToSellOut && (
                <div className="bg-orange-100 text-orange-800 px-3 py-1.5 text-xs rounded-lg inline-flex items-center font-semibold mb-4 border border-orange-200">
                  <i className="bi bi-fire mr-1 text-orange-600"></i> Likely to Sell Out
                </div>
              )}
              
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Select Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition"
                  >
                    {mockTour.availableDates.map((date) => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Travelers</label>
                  <input
                    type="number"
                    min={1}
                    max={mockTour.maxGuests}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F20C8F] focus:border-transparent transition"
                  />
                </div>
               <button
                  className="w-full py-3 rounded-lg font-semibold transition bg-[#F20C8F] text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center"
                  onClick={() => setShowAvailabilityModal(true)}
                  >
                  <i className="bi bi-calendar-check mr-2"></i>
                  Check Availability
                  </button>
              </div>

              <div className="text-center text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs">
                <p><span className="font-bold text-[#F20C8F]">Free booking!</span> Reserve now & pay later to secure your spot.</p>
              </div>
              
              <div className="flex flex-col gap-3 text-sm mb-6">
                {mockTour.freeCancellation && (
                  <div className="flex items-center gap-2 text-green-700">
                    <i className="bi bi-check-lg"></i>
                    <span className="font-medium">Free cancellation up to 24 hours</span>
                  </div>
                )}
                {mockTour.reserveNowPayLater && (
                  <div className="flex items-center gap-2 text-green-700">
                    <i className="bi bi-check-lg"></i>
                    <span className="font-medium">Reserve Now & Pay Later</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-blue-700">
                   <i className="bi bi-phone"></i>
                  <span className="font-medium">Mobile ticket accepted</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                   <i className="bi bi-translate"></i>
                  <span className="font-medium">Live guide in English & Greek</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-[#083A85] mb-2 text-sm">Need Help?</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-telephone"></i>
                    <span>+250 788 437 347</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bi bi-envelope"></i>
                    <span>support@Jambolush</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bi bi-clock"></i>
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>

              {/* Tour Operator Info */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-[#083A85] mb-2 text-sm">Tour Operator</h4>
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Karisimbi Volcano Climb</p>
                  <p>Guided & Safe Trekking</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-yellow-400 text-xs"></i>
                      ))}
                    </div>
                    <span className="text-xs">(4.8/5 based on 2,847 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-[#083A85]">Select Date & Time</h3>
                <p className="text-sm text-gray-600 mt-0.5">{guests} {guests === 1 ? 'traveler' : 'travelers'}</p>
              </div>
              <button 
                onClick={() => setShowAvailabilityModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col md:flex-row max-h-[calc(90vh-80px)]">
              
              {/* Calendar Section */}
              <div className="flex-1 p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200">
                <h4 className="text-md font-semibold mb-3 text-[#083A85]">Available Dates</h4>
                
                {calendarData.map((month, monthIdx) => (
                  <div key={monthIdx} className="mb-6">
                    <h5 className="text-sm font-semibold mb-3 text-gray-800">{month.name}</h5>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                          {day}
                        </div>
                      ))}
                      
                      {month.days.map((dayData, dayIdx) => (
                        <div key={dayIdx} className="aspect-square">
                          {dayData && (
                            <button
                              disabled={!dayData.isAvailable || dayData.isPast}
                              onClick={() => setSelectedDate(dayData.date)}
                              className={`w-full h-full flex flex-col items-center justify-center text-xs rounded-lg transition-all duration-200 ${
                                selectedDate === dayData.date
                                  ? 'bg-[#083A85] text-white shadow-lg'
                                  : dayData.isAvailable && !dayData.isPast
                                  ? 'hover:bg-[#F20C8F]/10 text-gray-900 border border-gray-200'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <span className="font-semibold">{dayData.day}</span>
                              {dayData.isAvailable && !dayData.isPast && (
                                <span className="text-xxs mt-0.5 font-bold">
                                  ${dayData.price}
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots Section */}
              <div className="md:w-64 p-4 overflow-y-auto bg-gray-50">
                <h4 className="text-md font-semibold mb-3 text-[#083A85]">Available Times</h4>
                
                {selectedDate ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedTimeSlot === slot.id
                            ? 'border-[#F20C8F] bg-[#F20C8F]/10'
                            : slot.available
                            ? 'border-gray-200 bg-white hover:border-[#F20C8F]/50 hover:bg-[#F20C8F]/5'
                            : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                        }`}
                        onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#083A85] text-sm">{slot.time}</span>
                              {slot.popular && (
                                <span className="bg-pink-100 text-pink-700 text-xxs px-1.5 py-0.5 rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{slot.duration}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-md font-bold text-[#F20C8F]">${slot.price}</div>
                            <div className="text-xxs text-gray-500">per person</div>
                          </div>
                        </div>
                        
                        {!slot.available && (
                          <div className="text-xs text-red-600 font-medium mt-1">Sold out</div>
                        )}
                      </div>
                    ))}
                    
                    {selectedTimeSlot && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-700 text-sm">Total ({guests} {guests === 1 ? 'traveler' : 'travelers'})</span>
                          <span className="text-lg font-bold text-[#F20C8F]">
                            ${(timeSlots.find(slot => slot.id === selectedTimeSlot)?.price || 0) * guests}
                          </span>
                        </div>
                        
                        <Link href={`/all/tour/${mockTour.id}/confirm-and-pay`} legacyBehavior>
                      <a className="w-full bg-[#F20C8F] hover:bg-opacity-90 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-center block text-sm">
                        Reserve Now
                      </a>
                    </Link>

                        
                        <p className="text-xxs text-gray-500 text-center mt-1.5">
                          Free cancellation up to 24 hours before
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-2 text-gray-400">
                    <i className="bi bi-calendar-event"></i>
                </div>
                <p>Select a date to view available times</p>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-md font-bold text-[#083A85]">Share with</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <button onClick={() => handleShare('facebook')} className="flex items-center gap-2 p-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 cursor-pointer">
                <i className="bi bi-facebook text-lg"></i>
                Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 p-2 rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors duration-200 cursor-pointer">
                <i className="bi bi-twitter-x text-lg"></i>
                Twitter
              </button>
              <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 p-2 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200 cursor-pointer">
                <i className="bi bi-whatsapp text-lg"></i>
                Whatsapp
              </button>
              <button onClick={() => handleShare('email')} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                <i className="bi bi-envelope-fill text-lg"></i>
                Email
              </button>
              <button onClick={() => handleShare('copy')} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200 col-span-2 justify-center cursor-pointer">
                <i className="bi bi-link-45deg text-lg"></i>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Photo Gallery Modal */}
      {showPhotoGalleryModal && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-2 -m-2 rounded-lg">
              <h3 className="text-xl font-bold text-[#083A85]">All Photos ({mockTour.images.length})</h3>
              <button
                onClick={() => setShowPhotoGalleryModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                ×
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto p-2">
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                    {mockTour.images.map((img, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden shadow-md break-inside-avoid">
                        <img src={img} alt={`Gallery photo ${idx + 1}`} className="w-full h-auto object-cover" />
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleTourPage;