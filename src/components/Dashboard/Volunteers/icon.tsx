import {
  CalendarDotsIcon,
  MapPinIcon,
  ShootingStarIcon,
  TranslateIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import { JSX } from "react";

export enum IconName {
  Translate = "translate",
  ShootingStar = "shootingStar",
  Wrench = "wrench",
  CalendarDots = "calendarDots",
  MapPin = "mapPin",
}

type IconMap = {
  [key in IconName]: JSX.Element;
};

export const iconNameMap: IconMap = {
  [IconName.Translate]: <TranslateIcon />,
  [IconName.ShootingStar]: <ShootingStarIcon />,
  [IconName.Wrench]: <WrenchIcon />,
  [IconName.CalendarDots]: <CalendarDotsIcon />,
  [IconName.MapPin]: <MapPinIcon />,
};
