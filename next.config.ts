import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tier-lisr-master",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
