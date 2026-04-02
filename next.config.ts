import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.137.1', '192.168.1.77', 'localhost'],
  images: {
    remotePatterns: [
      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Firebase Storage (primary & regional)
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      // Google user-content (profile images, CDN)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // Generic Google APIs storage
      { protocol: 'https', hostname: '*.googleapis.com' },
    ]
  }
};

export default nextConfig;
