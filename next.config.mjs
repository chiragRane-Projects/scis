/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // Unsplash uses this for premium/plus images
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com', // If you use Pexels video thumbnails
      },
    ],
  },
};

export default nextConfig;