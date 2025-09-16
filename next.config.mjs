/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper static generation
  output: 'standalone',
  // Fix for deployment issues
  trailingSlash: false,
  // Ensure all routes are properly handled
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/$1',
      },
    ]
  }
}

export default nextConfig
