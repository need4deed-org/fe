import { apiPrefix } from "@/config/constants";
import type { NextConfig } from "next";

const apiURL = process.env.API_URL || "http://localhost:5000";
const DEFAULT_ASSET_URL = "https://d2nwrdddg8skub.cloudfront.net/images";

function assetHostname(): string {
  const url = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || DEFAULT_ASSET_URL;
  try {
    return new URL(url).hostname;
  } catch {
    throw new Error(`NEXT_PUBLIC_CLOUDFRONT_URL is not a valid URL: "${url}"`);
  }
}

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    const eventPageDestination =
      "https://docs.google.com/forms/d/e/1FAIpQLSft1xi4NrQB_O6-OyOvVm_HcDSzQtog_3MMj2XAIVNaLKEJxA/viewform?usp=dialog";
    return [
      { source: "/event-page", destination: eventPageDestination, permanent: false },
      { source: "/event-page/", destination: eventPageDestination, permanent: false },
      { source: "/:lang/event-page", destination: eventPageDestination, permanent: false },
      { source: "/:lang/event-page/", destination: eventPageDestination, permanent: false },
    ];
  },
  async rewrites() {
    return [{ source: `/${apiPrefix}/:path*`, destination: `${apiURL}/:path*` }];
  },
  images: {
    domains: [assetHostname()],
  },
  output: "standalone",
};

export default nextConfig;
