/** @type {import('next').NextConfig} */

// GitHub Pages repository name
const repoName = 'brainwave-ai';

const nextConfig = {
  output: 'export',
  reactStrictMode: true,

  // Required for GitHub Pages
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  trailingSlash: true,

  images: {
    unoptimized: true,
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net',
      'picsum.photos',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'drive.google.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'BrainWave AI',
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://xstrem39.github.io/brainwave-ai/',
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    NEXT_PUBLIC_GOOGLE_SCRIPT_URL:
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  },

  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
