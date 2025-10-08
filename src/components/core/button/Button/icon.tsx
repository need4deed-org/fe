import { FadersHorizontalIcon, FadersIcon, XIcon } from "@phosphor-icons/react";
import { JSX } from "react";

export enum IconName {
  Faders = "faders",
  FadersHorizontal = "fadersHorizontal",
  X = "x",
}

export type IconMap = {
  [key in IconName]: JSX.Element;
};

export const iconNameMap: IconMap = {
  [IconName.FadersHorizontal]: <FadersHorizontalIcon />,
  [IconName.X]: <XIcon />,
  [IconName.Faders]: <FadersIcon />,
};
