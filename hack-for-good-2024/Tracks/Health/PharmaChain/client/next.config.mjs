/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['r10.ieee.org', 'pharma-trends.com'], // Add the external domain here
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds
  }
};

export default nextConfig;
