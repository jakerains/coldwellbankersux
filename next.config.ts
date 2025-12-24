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
      // External real estate listing images
      {
        protocol: "https",
        hostname: "ssl.cdn-redfin.com",
      },
      {
        protocol: "https",
        hostname: "*.zillowstatic.com",
      },
      {
        protocol: "https",
        hostname: "photos.zillowstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.rdcpix.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Additional real estate domains for Firecrawl results
      {
        protocol: "https",
        hostname: "www.homes.com",
      },
      {
        protocol: "https",
        hostname: "*.homes.com",
      },
      {
        protocol: "https",
        hostname: "*.realtor.com",
      },
      {
        protocol: "https",
        hostname: "ar.rdcpix.com",
      },
      {
        protocol: "https",
        hostname: "*.trulia.com",
      },
      {
        protocol: "https",
        hostname: "*.redfin.com",
      },
    ],
  },
};

export default nextConfig;
