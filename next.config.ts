import type { NextConfig } from "next";

import { CLOUDFRONT_HOSTNAME, apiPrefix, apiURL } from "@/config/constants";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      { source: `/${apiPrefix}/:path*`, destination: `${apiURL}/:path*` },
    ];
  },
  images: {
    domains: [CLOUDFRONT_HOSTNAME],
  },
  output: "standalone",
};

export default nextConfig;
