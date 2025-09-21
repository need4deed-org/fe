import { apiPrefix, CLOUDFRONT_HOSTNAME, apiURL } from "@/config/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [{ source: `/${apiPrefix}/:path*`, destination: `${apiURL}/:path*` }];
  },
  images: {
    domains: [CLOUDFRONT_HOSTNAME],
  },
};

export default nextConfig;
