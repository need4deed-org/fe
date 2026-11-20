import { apiPrefix, cloudfrontURL } from "@/config/constants";
import type { NextConfig } from "next";

const apiURL = process.env.API_URL || "http://localhost:5000";

function assetHostname(): string {
  const configured = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  if (configured !== undefined && configured.trim() === "") {
    throw new Error("NEXT_PUBLIC_CLOUDFRONT_URL is set but empty");
  }
  const url = cloudfrontURL;
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
    const legacyForms = [
      { from: "volunteer-form", to: "forms/volunteer" },
      { from: "opportunity-form", to: "register/organization" },
    ];
    const formRedirects = legacyForms.flatMap(({ from, to }) => [
      { source: `/${from}/:lng(de|en)`, destination: `/:lng/${to}`, permanent: true },
      { source: `/:lng(de|en)/${from}`, destination: `/:lng/${to}`, permanent: true },
      { source: `/${from}/:rest*`, destination: `/${to}`, permanent: true },
    ]);
    const pages = [
      { from: "about", to: "about" },
      { from: "faq", to: "faq" },
      { from: "agreement", to: "agreement" },
      { from: "legal-notice", to: "legal" },
      { from: "data-privacy", to: "privacy" },
      { from: "rac-guidelines", to: "rac-guidelines" },
      { from: "announcement", to: "announcement" },
      { from: "event-page", to: "events" },
    ];
    const pageRedirects = pages.map(({ from, to }) => ({
      source: `/${from}/:lng(de|en)`,
      destination: `/:lng/${to}`,
      permanent: true,
    }));
    const vpaRedirects = [
      { source: "/vpa/:lng(de|en)", destination: "/:lng/agreement", permanent: true },
      { source: "/:lng(de|en)/vpa", destination: "/:lng/agreement", permanent: true },
      { source: "/vpa", destination: "/agreement", permanent: true },
    ];

    const discussionsRedirects = [
      { source: "/:lng(de|en)/posts", destination: "/:lng/discussions", permanent: true },
      { source: "/posts", destination: "/discussions", permanent: true },
    ];

    const renamedRoutes = [
      { from: "dashboard/admin/ngo-volunteers", to: "organizations/volunteers" },
      { from: "dashboard/admin/domains", to: "organizations/domains" },
      { from: "dashboard/admin/statistics", to: "dashboard/statistics" },
      { from: "dashboard/admin", to: "dashboard" },
      { from: "dashboard/profile", to: "account" },
      { from: "dashboard/posts", to: "discussions" },
      { from: "dashboard/agents/:path*", to: "organizations/:path*" },
      { from: "dashboard/calendar/:path*", to: "calendar/:path*" },
      { from: "dashboard/opportunities/:path*", to: "opportunities/:path*" },
      { from: "dashboard/volunteers/:path*", to: "volunteers/:path*" },
      { from: "forgotten-password", to: "forgot-password" },
      { from: "register/agent/:path*", to: "register/organization/:path*" },
      { from: "legal-notice", to: "legal" },
      { from: "data-privacy", to: "privacy" },
      { from: "event-page/:path*", to: "events/:path*" },
      { from: "opportunity-cards", to: "volunteer" },
      { from: "for-organisations", to: "for-organizations" },
      { from: "forms/opportunity", to: "dashboard" },
    ];
    const renamedRouteRedirects = renamedRoutes.map(({ from, to }) => ({
      source: `/:lng(de|en)/${from}`,
      destination: `/:lng/${to}`,
      permanent: true,
    }));

    return [...formRedirects, ...pageRedirects, ...vpaRedirects, ...discussionsRedirects, ...renamedRouteRedirects];
  },
  async rewrites() {
    return [{ source: `/${apiPrefix}/:path*`, destination: `${apiURL}/:path*` }];
  },
  images: {
    domains: [assetHostname()],
    unoptimized: true,
  },
  output: "standalone",
};

export default nextConfig;
