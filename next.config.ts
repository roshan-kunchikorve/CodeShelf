import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Profile pictures come from GitHub and Google, so next/image must be told to trust those hosts.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
