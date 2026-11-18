import type { MetadataRoute } from "next";
import { siteURL, supportedLangs } from "@/config/constants";
import { RouteBuilder, routes } from "@/constants/routes";

const publicPages: RouteBuilder[] = [
  routes.home,
  routes.about,
  routes.faq,
  routes.volunteer,
  routes.volunteerForm,
  routes.events,
  routes.racGuidelines,
  routes.forOrganizations,
  routes.agreement,
  routes.legal,
  routes.privacy,
];

const pageURL = (lang: string, page: RouteBuilder) => `${siteURL}${page(lang)}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.flatMap((page) =>
    supportedLangs.map((lang) => ({
      url: pageURL(lang, page),
      alternates: {
        languages: Object.fromEntries(supportedLangs.map((alt) => [alt, pageURL(alt, page)])),
      },
    })),
  );
}
