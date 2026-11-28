import type { MetadataRoute } from "next";
import { siteURL, supportedLangs } from "@/config/constants";
import { ROUTES } from "@/constants/routes";

const publicPages: ((lang: string) => string)[] = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.faq,
  ROUTES.volunteer,
  ROUTES.volunteerForm,
  ROUTES.events,
  ROUTES.racGuidelines,
  ROUTES.forOrganizations,
  ROUTES.agreement,
  ROUTES.legal,
  ROUTES.privacy,
];

const pageURL = (lang: string, page: (lang: string) => string) => `${siteURL}${page(lang)}`;

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
