import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    return config;
  },
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn-icons-png.flaticon.com',
    },
  ],
}


};


export default nextConfig;
