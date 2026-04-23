
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  //  experimental: {
  //   turbopackFileSystemCacheForBuild: true,
  //   turbopackFileSystemCacheForDev: true,
  // },

   async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`,
      },
      {
       source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/:path*`, 
      }
    ];
  },
};

export default nextConfig;
