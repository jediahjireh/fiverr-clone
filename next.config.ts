import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: [
      "images.pexels.com",
      "fiverr-res.cloudinary.com",
      // UploadThing
      "utfs.io",
      // Google avatars
      "lh3.googleusercontent.com",
      "https://dummyimage.com",
    ],
  },
};

export default nextConfig;
