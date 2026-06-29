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
      { source: "/start", destination: "/start.html" },
      { source: "/start/", destination: "/start.html" },      { source: "/subscribe", destination: "/subscribe.html" },    ];
  },
  async redirects() {
    return [
      { source: "/blog/the-numbers-were-fine", destination: "/blog/the-room-knew-first", permanent: true },
      { source: "/field-notes/the-numbers-were-fine", destination: "/blog/the-room-knew-first", permanent: true },
    ];
  },
};

export default nextConfig;
