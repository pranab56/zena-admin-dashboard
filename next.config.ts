import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ismail4000.binarybards.online$",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ismail4000.binarybards.online",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ismail4000.binarybards.onlineimage",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.zenaapp.netimage",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5010",
        pathname: "/**",
      },
      // Add your specific uploads pattern
      {
        protocol: "http",
        hostname: "10.10.7.65",
        port: "5010",
        pathname: "/uploads/**",  // This specifically allows uploads folder
      },
    ],
  },
};

export default nextConfig;