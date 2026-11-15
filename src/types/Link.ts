import { Icon } from "@phosphor-icons/react";

export type Link = {
  route: string;
  label: string;
};

export type IconLink = Link & {
  Icon: Icon;
};
