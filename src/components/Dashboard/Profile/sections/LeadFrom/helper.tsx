import { JSX } from "react";
import { iconNameMap } from "../../common/icon";
import { IconName } from "../../types";

export type LeadIconMap = {
  [key in LeadFromEnum]: JSX.Element | undefined;
};

export const i18nPrefix = "dashboard.volunteerProfile.leadFromOptions";

export enum LeadFromEnum {
  PLATFORM = "platform",
  MEDIA = "media",
  NEWSLETTER = "newsletter",
  SEARCH = "search",
  FRIENDS = "Friends",
  FAIR = "fair",
  FLYER = "Flyer",
  NONE = "none",
}

export const LeadIconMap: LeadIconMap = {
  [LeadFromEnum.PLATFORM]: iconNameMap[IconName.Browser],
  [LeadFromEnum.MEDIA]: iconNameMap[IconName.Monitor],
  [LeadFromEnum.NEWSLETTER]: iconNameMap[IconName.Newspaper],
  [LeadFromEnum.SEARCH]: iconNameMap[IconName.MagnifyingGlass],
  [LeadFromEnum.FRIENDS]: iconNameMap[IconName.UsersThree],
  [LeadFromEnum.FAIR]: iconNameMap[IconName.Storefront],
  [LeadFromEnum.FLYER]: iconNameMap[IconName.Article],
  [LeadFromEnum.NONE]: undefined,
};

export type LeadIconKey = keyof typeof LeadIconMap;
