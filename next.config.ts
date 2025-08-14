import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production settings for Vercel deployment
  typescript: {
    ignoreBuildErrors: false, // Strict type checking in production
  },
  reactStrictMode: true, // Enable strict mode for production
  eslint: {
    ignoreDuringBuilds: false, // Strict linting in production
  },
  // Optimize for Vercel
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Environment variables that should be available to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
