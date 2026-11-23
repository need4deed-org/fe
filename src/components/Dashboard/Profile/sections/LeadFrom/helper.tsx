import {
  ArticleIcon,
  BrowserIcon,
  MagnifyingGlassIcon,
  MonitorPlayIcon,
  NewspaperClippingIcon,
  StorefrontIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

export enum LeadFromEnum {
  PLATFORM = "platform",
  MEDIA = "media",
  NEWSLETTER = "newsletter",
  SEARCH = "search",
  FRIENDS = "Friends",
  FAIR = "fair",
  FLYER = "Flyer",
}

export const LeadIconMap = {
  [LeadFromEnum.PLATFORM]: <BrowserIcon size={44} />,
  [LeadFromEnum.MEDIA]: <MonitorPlayIcon size={44} />,
  [LeadFromEnum.NEWSLETTER]: <NewspaperClippingIcon size={44} />,
  [LeadFromEnum.SEARCH]: <MagnifyingGlassIcon size={44} />,
  [LeadFromEnum.FRIENDS]: <UsersThreeIcon size={44} />,
  [LeadFromEnum.FAIR]: <StorefrontIcon size={44} />,
  [LeadFromEnum.FLYER]: <ArticleIcon size={44} />,
};

export type LeadIconKey = keyof typeof LeadIconMap;
