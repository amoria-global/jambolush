import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
