import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for automatic memoization
  reactCompiler: true,

  // Note: cacheComponents disabled - causes issues with useSearchParams in client components
  // Can be re-enabled when using "use cache" directive properly
  // cacheComponents: true,

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.moxi.onl",
      },
      {
        protocol: "https",
        hostname: "coldwellbankerabr.com",
      },
      {
        protocol: "https",
        hostname: "my.matterport.com",
      },
      {
        protocol: "https",
        hostname: "ap.rdcpix.com",
      },
    ],
  },
};

export default nextConfig;
