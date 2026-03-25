import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isStaticExport =
  process.env.NEXT_OUTPUT === 'export' ||
  process.env.CAPACITOR_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for mobile app (Capacitor)
  ...(isStaticExport ? { output: 'export' } : {}),
  skipTrailingSlashRedirect: true,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 365,
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Enable compression and optimizations
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
