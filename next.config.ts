import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Force cache busting on each build to prevent stale JavaScript
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // TypeScript errors will fail the build (ESLint config moved to separate file in Next.js 16)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Output configuration for Vercel deployment
  output: 'standalone',
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
