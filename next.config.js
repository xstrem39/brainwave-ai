/** @type {import('next').NextConfig} */
// SUBDIRECTORY DEPLOYMENT: Set NEXT_PUBLIC_BASE_PATH env var to deploy under a path
// e.g. NEXT_PUBLIC_BASE_PATH=/brainwave → accessible at tjvitalsource.com/brainwave
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: false,
  images: {
    domains: [
      'oaidalleapiprodscus.blob.core.windows.net',
      'picsum.photos',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'drive.google.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.paystack.co",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.anthropic.com https://api.openai.com https://generativelanguage.googleapis.com https://api.paystack.co wss:",
              "frame-src https://js.paystack.co",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.GOOGLE_SCRIPT_URL}/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
