"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const twinklePositions = Array.from({ length: 25 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.6 + 0.4, // Increased base scale
  }));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#00081A]">
       {/* Background */}
      <div className="absolute inset-0 z-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="housePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <g className="opacity-40">
                <path 
                  d="M10 3 L2 8 L2 17 L18 17 L18 8 L10 3 Z M4 15 L4 9 L16 9 L16 15 L4 15 Z" 
                  fill="#04092C"
                  stroke="#182237" 
                  strokeWidth="0.15"
                />
                <rect x="6" y="10" width="3" height="5" fill="none" stroke="#182237" strokeWidth="0.15"/>
                <rect x="11" y="10" width="3" height="2.5" fill="none" stroke="#182237" strokeWidth="0.15"/>
              </g>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#housePattern)" /> 
          
          {twinklePositions.map((pos, index) => (
            <motion.g
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 0.8 + Math.random() * 0.4, // Much faster twinkling (0.8-1.2s)
                repeat: Infinity,
                delay: Math.random() * 1,
                ease: "easeInOut"
              }}
            >
              {/* Star shape using path - 5-pointed star */}
              <path
                d={`M${pos.x} ${pos.y - 0.8 * pos.scale} 
                   L${pos.x + 0.2 * pos.scale} ${pos.y - 0.25 * pos.scale} 
                   L${pos.x + 0.76 * pos.scale} ${pos.y - 0.25 * pos.scale} 
                   L${pos.x + 0.24 * pos.scale} ${pos.y + 0.1 * pos.scale} 
                   L${pos.x + 0.4 * pos.scale} ${pos.y + 0.65 * pos.scale} 
                   L${pos.x} ${pos.y + 0.32 * pos.scale} 
                   L${pos.x - 0.4 * pos.scale} ${pos.y + 0.65 * pos.scale} 
                   L${pos.x - 0.24 * pos.scale} ${pos.y + 0.1 * pos.scale} 
                   L${pos.x - 0.76 * pos.scale} ${pos.y - 0.25 * pos.scale} 
                   L${pos.x - 0.2 * pos.scale} ${pos.y - 0.25 * pos.scale} Z`}
                fill="#ffffff"
                stroke="#cccccc"
                strokeWidth="0.03"
              />
              {/* Inner glow effect */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={0.3 * pos.scale}
                fill="#ffffff"
                opacity="0.6"
                filter="blur(0.1)"
              />
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Preloader Animation Container */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="relative"
              style={{ 
                width: '320px', 
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="relative" style={{ width: '300px', height: '300px' }}>
                
                {/* Step 1: J Symbol - Resized and repositioned */}
                <motion.div
                  className="absolute"
                  style={{ left: '60px', top: '100px' }} // Repositioned
                  initial={{ rotate: -360, opacity: 0, scale: -6 }}
                  animate={{ rotate: 0, opacity: 9, scale: 1 }}
                  transition={{ duration: 1.0, ease: [0.43, 0.43, 0.53, 0.96] }}
                >
                  <svg width="80" height="126" viewBox="0 0 50 70" fill="none"> {/* Resized */}
                    <path 
                      d="M40 0 L40 45 Q40 60 25 60 Q10 60 10 45 L10 35 L18 35 L18 45 Q18 52 25 52 Q32 52 32 45 L32 0 Z" 
                      fill="#ffffff" 
                    />
                  </svg>
                </motion.div>

                {/* Step 2: House Roof - Resized and positioned above J */}
                <motion.div
                  className="absolute"
                  style={{ left: '96.2px', top: '50px' }} // Repositioned to be above J
                  initial={{ y: -150, opacity: 0 }}
                  animate={{ y: 0, opacity: 10 }}
                  transition={{ 
                    delay: 1.0,
                    duration: 1.0,
                    type: "spring",
                    stiffness: 50,
                    damping: 9
                  }}
                >
                  <svg width="150" height="75" viewBox="0 0 100 50" fill="none">
                    <path d="M50 0 L0 25 L10 25 L10 50 L40 50 L40 35 L60 35 L60 50 L90 50 L90 25 L100 25 Z" fill="#ffffff"/>
                    {/* Windows */}
                    <rect x="20" y="30" width="15" height="10" fill="white"/>
                    <rect x="65" y="30" width="15" height="10" fill="white"/>
                  </svg>
                </motion.div>

                {/* Step 3: Elephant */}
                <motion.div
                  className="absolute"
                  style={{ left: '130px', top: '130px' }}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 10, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ delay: 1.0, duration: 0.8, ease: "easeInOut" }}
                  >
                    <Image
                      src="/eleh.png"
                      alt="Elephant"
                      width={90}
                      height={15}
                      priority={true}
                    />
                  </motion.div>
                </motion.div>

                {/* Step 4: Location Pin - Resized and positioned on elephant's back */}
                <motion.div
                  className="absolute"
                  style={{ left: '220px', top: '100px' }} // Repositioned
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: 1,
                    y: 25, // Adjusted drop distance to land on the back
                    rotate: 0,
                  }}
                  transition={{ 
                    delay: 2.9,
                    duration: 1.2,
                    y: { type: "spring", stiffness: 150, damping: 5, delay: 3.2 },
                    rotate: { duration: 0.1, delay: 3.2 },
                    scale: { ease: "backOut", duration: 0.5 },
                  }}
                >
                  <svg width="28" height="36" viewBox="0 0 30 40" fill="none"> {/* Resized */}
                    <path 
                      d="M15 0 C7 0 0 7 0 15 C0 23 15 40 15 40 S30 23 30 15 C30 7 23 0 15 0 Z M15 20 C12.2 20 10 17.8 10 15 S12.2 10 15 10 S20 12.2 20 15 S17.8 20 15 20 Z" 
                      fill="#ffffff"
                    />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center h-full"
          >
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}