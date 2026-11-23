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
  [LeadFromEnum.PLATFORM]: <BrowserIcon size={43} />,
  [LeadFromEnum.MEDIA]: <MonitorPlayIcon size={43} />,
  [LeadFromEnum.NEWSLETTER]: <NewspaperClippingIcon size={43} />,
  [LeadFromEnum.SEARCH]: <MagnifyingGlassIcon size={43} />,
  [LeadFromEnum.FRIENDS]: <UsersThreeIcon size={43} />,
  [LeadFromEnum.FAIR]: <StorefrontIcon size={43} />,
  [LeadFromEnum.FLYER]: <ArticleIcon size={43} />,
};

export type LeadIconKey = keyof typeof LeadIconMap;
