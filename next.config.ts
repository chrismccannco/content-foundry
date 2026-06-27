import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@libsql/client", "libsql"],
  async rewrites() {
    return [
      { source: "/field-assessment", destination: "/field-assessment.html" },
      { source: "/field-assessment/", destination: "/field-assessment.html" },
    ];
  },
};

export default nextConfig;
