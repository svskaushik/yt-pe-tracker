import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

// Wrap your Next.js config with the bundle analyzer
const nextConfig: NextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})( {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds for now
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
});

export default nextConfig;
