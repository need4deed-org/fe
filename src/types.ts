export interface PropsWithToken {
  token?: string | null;
}

export type MenuItemType = [string, string];

// Please, when adding a new line, ensure it's placed in a sorted way. !!!
export enum Subpage {
  ABOUT = "about",
  DATA_PRIVACY = "data-privacy",
  FAQ = "faq",
  LEGAL_NOTICE = "legal-notice",
  LOGIN = "login",
  OPPORTUNITY_CARDS = "opportunity-cards",
  VPA = "vpa",
}

export enum Env {
  DEVELOPMENT = "development",
  TEST = "test",
  PRODUCTION = "production",
}

export type FooterLink = [string, string];
