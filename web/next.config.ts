import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

// Wrap your Next.js config with the bundle analyzer
const nextConfig: NextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})( {
  reactStrictMode: true,
  eslint: {
    // Enable ESLint during builds for production safety
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript error checking during builds
    ignoreBuildErrors: false,
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
});

export default nextConfig;
