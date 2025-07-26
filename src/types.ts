export interface PropsWithToken {
  token?: string | null;
}

export type MenuItemType = [string, string];

export enum Subpage {
  ABOUT = "about",
  LOGIN = "login",
  OPPORTUNITY_CARDS = "opportunity-cards",
}