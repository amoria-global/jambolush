"use client";
import React, { useState, useEffect } from 'react';
import { encodeId } from '@/app/utils/encoder';
import api from '@/app/api/apiService';
import AlertNotification from '@/app/components/notify';
import { calculateDisplayPrice, formatPrice } from '../../utils/pricing';

// Define the shape for our notification state
interface NotificationState {
  isVisible: boolean;
  message: string;
  type: "success" | "error";
}

interface HouseProps {
  house: {
    id: number;
    image: string;
    category: string;
    type?: string;
    title: string;
    pricePerNight: string | number; // Base price from backend
    location: string;
    beds: number;
    baths: number;
    rating?: number;
    reviews?: number;
    hostName?: string;
    availability?: string;
  };
  isInitiallyLiked?: boolean;
}

const HouseCard: React.FC<HouseProps> = ({ house, isInitiallyLiked = false }) => {
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
        type: 'property',
        itemId: house.id,
      };

      await api.post('/bookings/wishlist', payload);

      setIsLiked(true);
      notify('Added to your wishlist!', 'success');

    } catch (error: any) {
      console.error("Failed to add to wishlist:", error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      
      if (errorMessage.includes('already in your wishlist')) {
        setIsLiked(true); // Sync UI if server confirms it's already liked
        notify('This item is already in your wishlist.', 'error');
      } else {
        notify(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const encodedId = encodeId(house.id);

  // Calculate display price (base price + 10%)
  const basePrice = typeof house.pricePerNight === 'string' 
    ? parseFloat(house.pricePerNight.replace(/[^0-9.]/g, '')) 
    : house.pricePerNight;
  
  const displayPrice = calculateDisplayPrice(basePrice);

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

      {/* --- HOUSE CARD JSX --- */}
      <a href={`/all/property/${encodedId}`} className="block rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100">
        <div 
          className="relative h-40 bg-cover bg-center bg-gray-200"
          style={{ backgroundImage: `url(${house.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
          
          <div className="absolute top-2 left-2">
            <span className="bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/90 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
              {house.type ? house.type.charAt(0).toUpperCase() + house.type.slice(1) : house.category}
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
              ${displayPrice}/night
            </span>
            
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#083A85] to-[#0B4A9F] p-3 text-white h-full">
          <h3 className="text-sm font-bold mb-1 text-white group-hover:text-blue-100 transition-colors leading-tight line-clamp-2">
            {house.title}
          </h3>
          
          <div className="flex items-center mb-2 text-xs text-blue-100">
            <i className="bi bi-geo-alt-fill mr-1 text-xs"></i>
            <p className="truncate">{house.location}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-xs text-blue-100 mb-2">
            <div className="flex items-center justify-center bg-white/10 rounded px-1 py-0.5 backdrop-blur-sm">
              <i className="bi bi-house-door mr-1"></i>
              <span>{house.beds} beds</span>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded px-1 py-0.5 backdrop-blur-sm">
              <i className="bi bi-droplet mr-1"></i>
              <span>{house.baths} baths</span>
            </div>
            {house.rating && (
              <div className="flex items-center justify-center bg-white/10 rounded px-1 py-0.5 backdrop-blur-sm">
                <i className="bi bi-star-fill mr-1 text-yellow-300"></i>
                <span>{house.rating}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-xs text-blue-100">
            {house.hostName && (
              <span className="truncate">Host: {house.hostName}</span>
            )}
            {house.availability && (
              <span className="text-green-300">{house.availability}</span>
            )}
          </div>
        </div>
      </a>
    </>
  );
};

export default HouseCard;