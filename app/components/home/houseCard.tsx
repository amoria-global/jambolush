import React, { useState } from 'react';

interface HouseProps {
  house: {
    id: number;
    image: string;
    category: string;
    title: string;
    pricePerNight: string;
    location: string;
    beds: number;
    baths: number;
    rating?: number;
    reviews?: number;
    hostName?: string;
    availability?: string;
  };
}

const HouseCard: React.FC<HouseProps> = ({ house }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <a href={`/property/${house.id}`} className="block rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100">
      {/* Compact Image Section */}
      <div 
        className="relative h-40 bg-cover bg-center bg-gray-200"
        style={{ backgroundImage: `url(${house.image})` }}
      >
        {/* Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        
        {/* Category Badge - Professional Style */}
        <div className="absolute top-2 left-2">
          <span className="bg-gradient-to-r from-[#F20C8F] to-[#F20C8F]/20 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
            {house.category}
          </span>
        </div>
        
        {/* Heart Icon - Clear Background */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLikeToggle();
            }}
            className="rounded-xs transition-all duration-200 group/heart"
          >
            <i
              className={`${
                isLiked
                  ? 'bi bi-heart-fill text-red-400'
                  : 'bi bi-heart text-white group-hover/heart:text-[#F20C8F]'
              } text-2xl transition-colors duration-200 drop-shadow-lg`}
            ></i>
          </button>
        </div>

        {/* Price Per Night Overlay */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
            {house.pricePerNight}/night
          </span>
        </div>
      </div>

      {/* Compact Content Section */}
      <div className="bg-gradient-to-br from-[#083A85] to-[#0B4A9F] p-3 text-white h-full">
        {/* Title - Compact */}
        <h3 className="text-sm font-bold mb-1 text-white group-hover:text-blue-100 transition-colors leading-tight line-clamp-2">
          {house.title}
        </h3>
        
        {/* Location with Icon */}
        <div className="flex items-center mb-2 text-xs text-blue-100">
          <i className="bi bi-geo-alt-fill mr-1 text-xs"></i>
          <p className="truncate">{house.location}</p>
        </div>
        
        {/* Property Details - Compact Grid */}
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

        {/* Host and Availability Info */}
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
  );
};

export default HouseCard;