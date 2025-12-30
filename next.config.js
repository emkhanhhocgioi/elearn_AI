/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'bing.com',
      },
    ],
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
