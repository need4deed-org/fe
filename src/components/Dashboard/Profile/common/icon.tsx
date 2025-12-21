import {
  ChartLineIcon,
  ChatCircleDotsIcon,
  ChatsCircleIcon,
  ClipboardTextIcon,
  ShootingStarIcon,
  UserCheckIcon,
} from "@phosphor-icons/react";
import { JSX } from "react";
import { IconName } from "../types/types";

type IconMap = {
  [key in IconName]: JSX.Element;
};

export const iconNameMap: IconMap = {
  [IconName.ChartLine]: <ChartLineIcon />,
  [IconName.ChatCircleDots]: <ChatCircleDotsIcon />,
  [IconName.ChatsCircle]: <ChatsCircleIcon />,
  [IconName.ClipboardText]: <ClipboardTextIcon />,
  [IconName.ShootingStar]: <ShootingStarIcon />,
  [IconName.UserCheck]: <UserCheckIcon />,
};
