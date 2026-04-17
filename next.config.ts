import { apiPrefix } from "@/config/constants";
import type { NextConfig } from "next";

const apiURL = process.env.API_URL || "http://localhost:5000";
const CLOUDFRONT_HOSTNAME = "d2nwrdddg8skub.cloudfront.net";


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
  output: "standalone",
};

export default nextConfig;
