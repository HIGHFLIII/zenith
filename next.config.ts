import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  // The dev server is opened at 127.0.0.1, which is a different host from localhost.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
        pathname: "/steam/apps/**",
      },
    ],
  },
};

export default nextConfig;
