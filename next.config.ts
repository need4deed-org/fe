import { CLOUDFRONT_HOSTNAME } from "@/config/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://vmpub:5000/:path*" }];
  },
  images: {
    domains: [CLOUDFRONT_HOSTNAME],
  },
};

export default nextConfig;
