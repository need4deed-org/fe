export const tokenKey = "token";

export const urlApi = "/api";
export const urlApiVolunteer = `${urlApi}/volunteer`;

export const urlApiAuthEmailDomain = `${urlApi}/auth-email-domain`;

export enum ScreenTypes {
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop",
}

export const screenSizeThresholds = {
  tablet: 768,
  desktop: 1440,
};

export const eightDays = 1000 * 60 * 60 * 24 * 8;

export const phoneRegEx = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export const n4dLanguageLocalStorageKey = "n4d-language";

export const eventsSectionContainerId = "events-section-container";

export const CLOUDFRONT_URL = "https://d2nwrdddg8skub.cloudfront.net/images";
export const CLOUDFRONT_HOSTNAME = "d2nwrdddg8skub.cloudfront.net";

export enum SortOrder {
  NewToOld = "newestToOldest",
  OldToNew = "oldestToNewest",
}

export const minPLZGermany = 1067;
export const maxPLZGermany = 99998;

export const minPLZBerlin = 10115;
export const maxPLZBerlin = 14199;
