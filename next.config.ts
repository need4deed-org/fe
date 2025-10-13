import { CLOUDFRONT_HOSTNAME, apiURL } from "@/config/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiURL}/:path*` }];
  },
  images: {
    domains: [CLOUDFRONT_HOSTNAME],
  },
};

export default nextConfig;
