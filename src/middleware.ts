import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "need4deed-sdk";
import { langCookieName } from "./config/constants";
import {
  decodeJwtPayload,
  getPathLanguage,
  getPathLanguagePrefix,
  localizedPath,
  getPreferredLanguage,
} from "./utils/helpers";

const REFRESH = "refresh";

const authorizedRoutes = {
  AGENT: { regex: /^(?:\/[a-z]{2})?\/dashboard\/agents\/([0-9]+)$/, redirect: "/dashboard/agents" },
  ORGANIZATION: { regex: /^(?:\/[a-z]{2})?\/dashboard\/organizations\/([0-9]+)$/, redirect: "/dashboard" },
  NEW_OPPORTUNITIES: { regex: /^(?:\/[a-z]{2})?\/forms\/opportunity(?:\/|$)/ },
  DASHBOARD: { regex: /^(?:\/[a-z]{2})?\/dashboard(?:\/|$)/ },
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const currentLocale = getPathLanguage(pathname);
  const locale = getPreferredLanguage(pathname, request.cookies.get(langCookieName)?.value);

  const redirectTo = (path: string, { clearSearch = false } = {}) => {
    const url = request.nextUrl.clone();
    if (clearSearch) url.search = "";
    url.pathname = localizedPath(locale, path);
    return NextResponse.redirect(url);
  };

  const token = request.cookies.get(REFRESH)?.value;

  if (!token) {
    const isDashboard = authorizedRoutes.DASHBOARD.regex.test(pathname);
    if (isDashboard || authorizedRoutes.NEW_OPPORTUNITIES.regex.test(pathname)) {
      return redirectTo("/login", { clearSearch: isDashboard });
    }
  }

  if (token) {
    const userObject = decodeJwtPayload(token);
    const isAuthorized =
      (userObject && userObject.role === UserRole.ADMIN) || (userObject && userObject.role === UserRole.COORDINATOR);

    // Allowlist: any other role or an undecodable token is sent away.
    const adminRegex = /^(?:\/[a-z]{2})?\/dashboard\/admin(?:\/|$)/;
    if (!isAuthorized && adminRegex.test(pathname)) {
      return redirectTo("/dashboard");
    }

    const volunteerRestrictedRegex =
      /^(?:\/[a-z]{2})?\/dashboard\/(volunteers|agents|organizations|posts|calendar)(?:\/|$)/;
    if (userObject?.role === UserRole.VOLUNTEER && volunteerRestrictedRegex.test(pathname)) {
      return redirectTo("/dashboard");
    }

    const isAgentDetail = authorizedRoutes.AGENT.regex.test(pathname);
    if (isAgentDetail && !isAuthorized && userObject?.role !== UserRole.AGENT) {
      return redirectTo(authorizedRoutes.AGENT.redirect);
    }

    const isOrganizationDetail = authorizedRoutes.ORGANIZATION.regex.test(pathname);
    if (isOrganizationDetail && !isAuthorized && userObject?.role !== UserRole.AGENT) {
      return redirectTo(authorizedRoutes.ORGANIZATION.redirect);
    }

    const agentRestrictedRegex = /^(?:\/[a-z]{2})?\/dashboard\/calendar(?:\/|$)/;
    if (userObject?.role === UserRole.AGENT && agentRestrictedRegex.test(pathname)) {
      return redirectTo("/dashboard");
    }
  }

  if (!currentLocale) {
    const unsupportedPrefix = getPathLanguagePrefix(pathname);
    const unprefixedPath = unsupportedPrefix ? pathname.slice(unsupportedPrefix.length + 1) : pathname;
    return redirectTo(unprefixedPath);
  }

  const response = NextResponse.next();
  response.cookies.set(langCookieName, currentLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next(?:/|$)|api(?:/|$)|health(?:/|$)|\\.well-known(?:/|$)|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|json|webmanifest|txt|xml|woff2?|pdf)$).*)",
  ],
};
