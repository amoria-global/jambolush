"use client";
import React, { useState, useEffect } from 'react';
import { encodeId } from '@/app/utils/encoder';
import api from '@/app/api/apiService';
import AlertNotification from '@/app/components/notify';
import { calculateDisplayPrice } from '../../utils/pricing';

// Define the shape for our notification state
interface NotificationState {
  isVisible: boolean;
  message: string;
  type: "success" | "error";
}

interface TourProps {
  tour: {
    id: number;
    mainImage: string;
    category: string;
    type?: string;
    title: string;
    pricePerNight: string | number;
    location: string;
    duration: number;
    difficulty: string;
    groupSize?: number;
    rating?: number;
    reviews?: number;
    hostName?: string;
    availability?: string;
  };
  isInitiallyLiked?: boolean;
}

const TourCard: React.FC<TourProps> = ({ tour, isInitiallyLiked = false }) => {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Sync state if the initial liked status prop changes
  useEffect(() => {
    setIsLiked(isInitiallyLiked);
  }, [isInitiallyLiked]);

  /**
   * Triggers a notification to be displayed.
   */
  const notify = (message: string, type: "success" | "error") => {
    setNotification({ isVisible: true, message, type });
  };

  /**
   * Handles adding an item to the user's wishlist via an API call.
   */
  const handleAddToWishlist = async () => {
    if (isLoading || isLiked) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.assign("/all/login?redirect=/");
        return;
      }

      api.setAuth(token);

      const payload = {
        type: 'tour',
        itemId: tour.id,
      };

      await api.post('/bookings/wishlist', payload);

      setIsLiked(true);
      notify('Added to your wishlist!', 'success');

    } catch (error: any) {
      console.error("Failed to add to wishlist:", error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';

      if (errorMessage.includes('already in your wishlist')) {
        setIsLiked(true); // Sync UI if server confirms it's already liked
        notify('This tour is already in your wishlist.', 'error');
      } else {
        notify(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const encodedId = encodeId(tour.id);

  // Calculate display price (base price + 10%)
  const basePrice = typeof tour.pricePerNight === 'string'
    ? parseFloat(tour.pricePerNight.replace(/[^0-9.]/g, ''))
    : tour.pricePerNight;

  const displayPrice = calculateDisplayPrice(basePrice);

  // Format duration
  const formatDuration = (days: number): string => {
    if (days < 1) return `${Math.floor(days * 24)}hrs`;
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  return (
    <>
      {/* --- NOTIFICATION COMPONENT --- */}
      {notification.isVisible && (
        <AlertNotification
          message={notification.message}
          type={notification.type}
          position="bottom-center"
          onClose={() => setNotification({ ...notification, isVisible: false })}
        />
      )}

      {/* --- TOUR CARD JSX --- */}
      <a href={`/tours/${encodedId}`} className="block rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100">
        <div
          className="relative h-40 bg-cover bg-center bg-gray-200"
          style={{ backgroundImage: `url(${tour.mainImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

          <div className="absolute top-2 left-2">
            <span className="bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
              {tour.type ? tour.type.charAt(0).toUpperCase() + tour.type.slice(1) : tour.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToWishlist();
              }}
              disabled={isLoading}
              className="rounded-xs transition-all duration-200 group/heart"
            >
              <i
                className={`${
                  isLiked
                    ? 'bi bi-heart-fill text-red-400'
                    : 'bi bi-heart text-white group-hover/heart:text-[#F20C8F]'
                } text-2xl transition-colors duration-200 drop-shadow-lg ${isLoading ? 'animate-pulse' : ''}`}
              ></i>
            </button>
          </div>

          <div className="absolute bottom-2 left-2">
            <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
              ${displayPrice}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#083A85] to-[#0B4A9F] p-3 text-white h-full">
          <h3 className="text-sm font-bold mb-1 text-white group-hover:text-blue-100 transition-colors leading-tight line-clamp-2">
            {tour.title}
          </h3>

          <div className="flex items-center mb-2 text-xs text-blue-100">
            <i className="bi bi-geo-alt-fill mr-1 text-xs"></i>
            <p className="truncate">{tour.location}</p>
          </div>

          <div className="grid grid-cols-3 gap-1 text-xs text-blue-100 mb-2">
            <div className="flex items-center justify-center bg-white/10 rounded px-1 py-0.5 backdrop-blur-sm">
              <i className="bi bi-clock mr-1"></i>
              <span>{formatDuration(tour.duration)}</span>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded px-1 py-0.5 backdrop-blur-sm">
              <i className="bi bi-activity mr-1"></i>
              <span className="capitalize">{tour.difficulty}</span>
            </div>
            {tour.rating && tour.rating > 0 && (
              <div className="flex items-center justify-center bg-white/10 rounded px-1 py-0.5 backdrop-blur-sm">
                <i className="bi bi-star-fill mr-1 text-yellow-300"></i>
                <span>{tour.rating}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-xs text-blue-100">
            {tour.hostName && (
              <span className="truncate">Guide: {tour.hostName}</span>
            )}
            
          </div>
        </div>
      </a>
    </>
  );
};

export default TourCard;
