import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userAgent } from "next/server";
import { supportedLangs } from "./config/constants";
import { Lang } from "need4deed-sdk";

const DEFAULT_LOCALE = Lang.DE;
const DEFAULT_DEVICE_TYPE = "desktop";
const DEVICE_HEADER_NAME = "x-device-type";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localePrefixRegex = /^\/([a-z]{2})(?:\/|$)/i;
  const match = pathname.match(localePrefixRegex);
  const currentLocale = match ? match[1] : null;

  let redirectNeeded = false;
  let newPathname = pathname;

  if (currentLocale) {
    const isSupportedLocale = supportedLangs.includes(currentLocale);

    if (!isSupportedLocale) {
      const pathWithoutLocalePrefix = pathname.substring(currentLocale.length + 1);

      newPathname = `/${DEFAULT_LOCALE}${pathWithoutLocalePrefix}`;
      redirectNeeded = true;
    }
  } else {
    newPathname = `/${DEFAULT_LOCALE}${pathname}`;
    redirectNeeded = true;
  }

  if (redirectNeeded && newPathname !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  const { device } = userAgent({ headers: request.headers });

  const deviceType = device.type || DEFAULT_DEVICE_TYPE;

  response.headers.set(DEVICE_HEADER_NAME, deviceType);

  return response;
}

/*
 *  The `config.matcher` array is used to selectively run the middleware
 * on specific paths. This is crucial for performance and preventing
 * middleware from running on static assets, API routes, or Next.js internals.
 */
export const config = {
  // The matcher accepts an array of path patterns to match.
  // Patterns should use the format: '/:path*'
  //
  // 1. `/((?!_next|favicon.ico|api).*)`
  //    - `((?! ... ))`: A negative lookahead, meaning "don't match any of the following patterns."
  //    - `_next`: Excludes all Next.js internal paths (e.g., static files, build assets).
  //    - `favicon.ico`: Explicitly excludes the favicon from middleware processing.
  //    - `api`: Excludes all API routes in `/pages/api` or `/app/api`.
  //    - `.*`: Matches every other path.
  //
  // This effectively runs the middleware on all pages/routes except Next.js internals,
  // static assets, and API routes.
  // Also excludes common file extensions like .pdf, .png, .jpg, etc.
  matcher: ["/((?!_next|static|favicon.ico|api|.well-known|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico).*)"],
};
