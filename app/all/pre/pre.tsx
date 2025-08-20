"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Generate random house positions for background pattern
  const housePatternPositions = [
    { x: 10, y: 10, scale: 0.8 },
    { x: 30, y: 5, scale: 0.6 },
    { x: 50, y: 15, scale: 0.7 },
    { x: 70, y: 8, scale: 0.9 },
    { x: 85, y: 12, scale: 0.65 },
    { x: 15, y: 35, scale: 0.75 },
    { x: 40, y: 40, scale: 0.8 },
    { x: 65, y: 38, scale: 0.7 },
    { x: 80, y: 45, scale: 0.85 },
    { x: 5, y: 60, scale: 0.7 },
    { x: 25, y: 65, scale: 0.9 },
    { x: 45, y: 70, scale: 0.6 },
    { x: 60, y: 62, scale: 0.8 },
    { x: 75, y: 68, scale: 0.75 },
    { x: 90, y: 75, scale: 0.85 },
    { x: 20, y: 85, scale: 0.7 },
    { x: 35, y: 90, scale: 0.8 },
    { x: 55, y: 88, scale: 0.65 },
    { x: 72, y: 92, scale: 0.9 },
    { x: 88, y: 95, scale: 0.7 }
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Background House Drawing Pattern with Twinkling Effect */}
      <div className="absolute inset-0 z-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="housePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <g className="opacity-10">
                {/* Simple house outline */}
                <path 
                  d="M4 10 L4 7 L10 3 L16 7 L16 10 L4 10" 
                  fill="rgba(245, 245, 245, 0.5)"
                  stroke="#d1d5db" 
                  strokeWidth="0.15"
                />
                <path 
                  d="M3 7 L10 2 L17 7" 
                  fill="none" 
                  stroke="#d1d5db" 
                  strokeWidth="0.15"
                />
                <rect x="6" y="7.5" width="1.5" height="2.5" fill="none" stroke="#d1d5db" strokeWidth="0.1"/>
                <rect x="9" y="8" width="1" height="1" fill="none" stroke="#d1d5db" strokeWidth="0.1"/>
                <rect x="11.5" y="8" width="1" height="1" fill="none" stroke="#d1d5db" strokeWidth="0.1"/>
                {/* Trees */}
                <ellipse cx="1.5" cy="9" rx="1" ry="1.5" fill="none" stroke="#d1d5db" strokeWidth="0.1"/>
                <ellipse cx="18.5" cy="9" rx="1" ry="1.5" fill="none" stroke="#d1d5db" strokeWidth="0.1"/>
              </g>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#housePattern)" />
          
          {/* Twinkling stars overlay */}
          {housePatternPositions.map((pos, index) => (
            <motion.circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r={0.2 * pos.scale}
              fill="#e5e7eb"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0.5, 0.2, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </svg>
      </div>

      {/* Preloader Animation Container */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 6x6 cm container (approximately 226px at 96 DPI) */}
            <div 
              className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl"
              style={{ 
                width: '226px', 
                height: '226px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Logo Animation Components */}
              <div className="relative" style={{ width: '180px', height: '180px' }}>
                
                {/* Step 1: J Symbol - Horizontal to Vertical */}
                <motion.div
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '55%',
                    transformOrigin: 'center',
                  }}
                  initial={{ 
                    rotate: -90,
                    opacity: 0,
                    x: -40,
                    y: 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    rotate: 0,
                    opacity: 1,
                    x: -15,
                    y: 0,
                    scale: 1
                  }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                >
                  <svg width="50" height="70" viewBox="0 0 50 70" fill="none">
                    <path 
                      d="M40 0 L40 45 Q40 60 25 60 Q10 60 10 45 L10 35 L18 35 L18 45 Q18 52 25 52 Q32 52 32 45 L32 0 Z" 
                      fill="#1a2332"
                    />
                  </svg>
                </motion.div>

                {/* Step 2: House Roof Dropping from Top */}
                <motion.div
                  className="absolute"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                  initial={{ 
                    top: '-150px',
                    opacity: 0,
                    scale: 0.9
                  }}
                  animate={{ 
                    top: '15px',
                    opacity: 1,
                    scale: 1
                  }}
                  transition={{ 
                    delay: 0.8,
                    duration: 0.7,
                    type: "spring",
                    stiffness: 120,
                    damping: 12
                  }}
                >
                  <svg width="100" height="50" viewBox="0 0 100 50" fill="none">
                    <path 
                      d="M50 0 L10 35 L20 35 L50 10 L80 35 L90 35 Z" 
                      fill="#1a2332"
                    />
                    <rect x="70" y="20" width="12" height="30" fill="#1a2332"/>
                    <rect x="35" y="35" width="30" height="2" fill="#1a2332"/>
                  </svg>
                </motion.div>

                {/* Step 3: Elephant Walking from Right */}
                <motion.div
                  className="absolute"
                  style={{
                    top: '55%',
                    transform: 'translateY(-50%)',
                  }}
                  initial={{ 
                    right: '-200px',
                    opacity: 0
                  }}
                  animate={{ 
                    right: '25px',
                    opacity: 1
                  }}
                  transition={{ 
                    delay: 1.5,
                    duration: 1.2,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <svg width="70" height="55" viewBox="0 0 70 55" fill="none">
                    {/* Elephant Body */}
                    <ellipse cx="35" cy="25" rx="22" ry="18" fill="#1a2332"/>
                    {/* Head */}
                    <circle cx="18" cy="22" r="13" fill="#1a2332"/>
                    {/* Animated Trunk */}
                    <motion.path
                      d="M8 25 Q3 30 5 35 Q7 40 12 38"
                      stroke="#1a2332"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      animate={{
                        d: [
                          "M8 25 Q3 30 5 35 Q7 40 12 38",
                          "M8 25 Q1 28 3 33 Q5 38 10 36",
                          "M8 25 Q3 30 5 35 Q7 40 12 38",
                        ]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: 3,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                    />
                    {/* Legs with walking animation */}
                    <motion.rect 
                      x="17" y="35" width="7" height="13" fill="#1a2332"
                      animate={{ y: [35, 33, 35] }}
                      transition={{ duration: 0.3, repeat: 4, delay: 1.5 }}
                    />
                    <motion.rect 
                      x="28" y="35" width="7" height="13" fill="#1a2332"
                      animate={{ y: [35, 33, 35] }}
                      transition={{ duration: 0.3, repeat: 4, delay: 1.6 }}
                    />
                    <motion.rect 
                      x="39" y="35" width="7" height="13" fill="#1a2332"
                      animate={{ y: [35, 33, 35] }}
                      transition={{ duration: 0.3, repeat: 4, delay: 1.7 }}
                    />
                    <motion.rect 
                      x="50" y="35" width="7" height="13" fill="#1a2332"
                      animate={{ y: [35, 33, 35] }}
                      transition={{ duration: 0.3, repeat: 4, delay: 1.8 }}
                    />
                    {/* Ear */}
                    <path d="M18 12 Q13 7 8 12 Q8 22 18 22 Z" fill="#1a2332"/>
                    {/* Eye */}
                    <circle cx="16" cy="19" r="1.5" fill="white"/>
                    {/* Tail */}
                    <path d="M52 20 Q58 18 55 25" stroke="#1a2332" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                </motion.div>

                {/* Step 4: Location Pin Emerging and Falling */}
                <motion.div
                  className="absolute"
                  style={{
                    right: '30px',
                    top: '30%',
                  }}
                  initial={{ 
                    scale: 0,
                    opacity: 0,
                    rotate: 0,
                    x: -30
                  }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: 1,
                    rotate: 20,
                    x: 0,
                    y: [0, 0, 45],
                  }}
                  transition={{ 
                    delay: 2.7,
                    scale: {
                      duration: 0.5,
                      times: [0, 0.6, 1],
                      ease: "backOut"
                    },
                    y: {
                      delay: 3.2,
                      duration: 0.5,
                      times: [0, 0, 1],
                      type: "spring",
                      stiffness: 250,
                      damping: 15
                    },
                    rotate: {
                      delay: 3.2,
                      duration: 0.5
                    }
                  }}
                >
                  <motion.svg 
                    width="30" height="40" 
                    viewBox="0 0 30 40" 
                    fill="none"
                    animate={{
                      filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                    }}
                    transition={{
                      delay: 2.7,
                      duration: 0.3
                    }}
                  >
                    <path 
                      d="M15 0 C7 0 0 7 0 15 C0 23 15 40 15 40 S30 23 30 15 C30 7 23 0 15 0 Z M15 20 C12.2 20 10 17.8 10 15 S12.2 10 15 10 S20 12.2 20 15 S17.8 20 15 20 Z" 
                      fill="#1a2332"
                    />
                  </motion.svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content After Loading */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-5 flex items-center justify-center h-full px-4"
          >
            <div className="text-center max-w-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1a2332] rounded-2xl">
                  <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                    <path d="M25 60 L25 45 Q25 35 35 35 Q45 35 45 45 L45 60 L40 60 L40 45 Q40 40 35 40 Q30 40 30 45 L30 60 Z" fill="white"/>
                    <path d="M50 20 L20 40 L25 40 L50 25 L75 40 L80 40 Z" fill="white"/>
                    <rect x="65" y="32" width="8" height="20" fill="white"/>
                    <ellipse cx="60" cy="50" rx="12" ry="10" fill="white" opacity="0.9"/>
                    <path d="M75 35 C70 35 65 40 65 45 C65 50 75 60 75 60 S85 50 85 45 C85 40 80 35 75 35 Z" fill="white" opacity="0.8"/>
                  </svg>
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-5xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Find Your Perfect Stay
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Discover unique homes and experiences around the world
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 justify-center"
              >
                <motion.button
                  className="px-8 py-3 bg-[#1a2332] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Properties
                </motion.button>
                <motion.button
                  className="px-8 py-3 border-2 border-[#1a2332] text-[#1a2332] rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  List Your Space
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}