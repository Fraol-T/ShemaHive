import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // All product imagery is the client's own, served from /public/products.
  // The Unsplash remote pattern was removed with the placeholder catalog.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Pin the workspace root; a stray lockfile in the home directory otherwise
  // makes Turbopack guess wrong and warn on every build.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
