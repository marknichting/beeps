import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'loremflickr.com',
        port: '',
        pathname: '/**/*',
      },
    ],
  },
};

export default nextConfig;
