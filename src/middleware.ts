import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userAgent } from "next/server";
import { defaultRouteLang, langCookieName, supportedLangs } from "./config/constants";
import { Lang, UserRole } from "need4deed-sdk";
import { decodeJwtPayload, getPathLanguage, getPathLanguagePrefix, localizedPath } from "./utils/helpers";
import { ROUTES } from "./constants/routes";

const DEFAULT_DEVICE_TYPE = "desktop";
const DEVICE_HEADER_NAME = "x-device-type";
const REFRESH = "refresh";

const appSections =
  "dashboard|opportunities|volunteers|organizations|discussions|calendar|metrics|settings|accounts|emails|help";

const authorizedRoutes = {
  AGENT: { regex: /^(?:\/[a-z]{2})?\/organizations\/([0-9]+)$/, redirect: ROUTES.organizations },
  OPERATOR: { regex: /^(?:\/[a-z]{2})?\/organizations\/operators\/([0-9]+)$/, redirect: ROUTES.dashboard },
  NEW_OPPORTUNITIES: { regex: /^(?:\/[a-z]{2})?\/forms\/opportunity(?:\/|$)/ },
  DASHBOARD: { regex: new RegExp(`^(?:/[a-z]{2})?/(?:${appSections})(?:/|$)`) },
};

function getAcceptLanguageLocale(header: string | null): Lang | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const quality = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { lang: tag.split("-")[0].toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality);

  return (ranked.find(({ lang }) => supportedLangs.includes(lang))?.lang as Lang | undefined) ?? null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const currentLocale = getPathLanguage(pathname);
  const cookieLang = request.cookies.get(langCookieName)?.value;
  const preferredLocale =
    (cookieLang && supportedLangs.includes(cookieLang) ? (cookieLang as Lang) : null) ??
    getAcceptLanguageLocale(request.headers.get("accept-language")) ??
    defaultRouteLang;
  const lang = currentLocale ?? preferredLocale;

  const redirectTo = (path: string, { clearSearch = false } = {}) => {
    const url = request.nextUrl.clone();
    if (clearSearch) url.search = "";
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  const token = request.cookies.get(REFRESH)?.value;

  if (!token) {
    const isAppRoute = authorizedRoutes.DASHBOARD.regex.test(pathname);
    if (isAppRoute || authorizedRoutes.NEW_OPPORTUNITIES.regex.test(pathname)) {
      return redirectTo(ROUTES.login(lang), { clearSearch: isAppRoute });
    }
  }

  if (token) {
    const userObject = decodeJwtPayload(token);
    const isAuthorized =
      (userObject && userObject.role === UserRole.ADMIN) || (userObject && userObject.role === UserRole.COORDINATOR);

    const adminOnlyRegex =
      /^(?:\/[a-z]{2})?\/(?:metrics|accounts|emails|organizations\/(?:domains|volunteers))(?:\/|$)/;
    if (!isAuthorized && adminOnlyRegex.test(pathname)) {
      return redirectTo(ROUTES.dashboard(lang));
    }

    const volunteerRestrictedRegex = /^(?:\/[a-z]{2})?\/(volunteers|organizations|discussions|calendar)(?:\/|$)/;
    if (userObject?.role === UserRole.VOLUNTEER && volunteerRestrictedRegex.test(pathname)) {
      return redirectTo(ROUTES.dashboard(lang));
    }

    const isAgentDetail = authorizedRoutes.AGENT.regex.test(pathname);
    if (isAgentDetail && !isAuthorized && userObject?.role !== UserRole.AGENT) {
      return redirectTo(authorizedRoutes.AGENT.redirect(lang));
    }

    const isOperatorDetail = authorizedRoutes.OPERATOR.regex.test(pathname);
    if (isOperatorDetail && !isAuthorized && userObject?.role !== UserRole.AGENT) {
      return redirectTo(authorizedRoutes.OPERATOR.redirect(lang));
    }

    const agentRestrictedRegex = /^(?:\/[a-z]{2})?\/(?:calendar(?:\/|$)|organizations\/?$)/;
    if (userObject?.role === UserRole.AGENT && agentRestrictedRegex.test(pathname)) {
      return redirectTo(ROUTES.dashboard(lang));
    }
  }

  if (!currentLocale) {
    const unsupportedPrefix = getPathLanguagePrefix(pathname);
    const unprefixedPath = unsupportedPrefix ? pathname.slice(unsupportedPrefix.length + 1) : pathname;
    return redirectTo(localizedPath(preferredLocale, unprefixedPath));
  }

  const response = NextResponse.next();
  response.cookies.set(langCookieName, currentLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const { device } = userAgent({ headers: request.headers });
  response.headers.set(DEVICE_HEADER_NAME, device.type || DEFAULT_DEVICE_TYPE);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next(?:/|$)|api(?:/|$)|health(?:/|$)|\\.well-known(?:/|$)|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|json|webmanifest|txt|xml|woff2?|pdf)$).*)",
  ],
};
