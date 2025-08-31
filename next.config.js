/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'via.placeholder.com'],
    unoptimized: true
  },
  env: {
    VITE_BACKEND_URI: process.env.VITE_BACKEND_URI || 'http://localhost:3001/',
  },
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig