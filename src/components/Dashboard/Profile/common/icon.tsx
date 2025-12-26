import {
  BabyIcon,
  BicycleIcon,
  CalendarStarIcon,
  ChartLineIcon,
  ChatCircleDotsIcon,
  ChatsCircleIcon,
  ChatsTeardropIcon,
  ClipboardTextIcon,
  PingPongIcon,
  ShootingStarIcon,
  SparkleIcon,
  UserCheckIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { JSX } from "react";
import { IconName } from "../types/types";

type IconMap = {
  [key in IconName]: JSX.Element;
};

export const iconNameMap: IconMap = {
  [IconName.Baby]: <BabyIcon />,
  [IconName.Bicycle]: <BicycleIcon />,
  [IconName.CalendarStar]: <CalendarStarIcon />,
  [IconName.ChartLine]: <ChartLineIcon />,
  [IconName.ChatCircleDots]: <ChatCircleDotsIcon />,
  [IconName.ChatsCircle]: <ChatsCircleIcon />,
  [IconName.ChatsTeardrop]: <ChatsTeardropIcon />,
  [IconName.ClipboardText]: <ClipboardTextIcon />,
  [IconName.PingPong]: <PingPongIcon />,
  [IconName.ShootingStar]: <ShootingStarIcon />,
  [IconName.Sparkle]: <SparkleIcon />,
  [IconName.UserCheck]: <UserCheckIcon />,
  [IconName.Users]: <UsersIcon />,
};
