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
      {
      protocol: 'http',
        hostname: 'media.cntraveler.com',
      },
    ],
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
