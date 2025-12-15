/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    root: '.',
  },
  // Enable compression and optimizations
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
