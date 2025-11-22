import Link from "next/link";

import { MenuItemType } from "@/types";

import MenuItem from "./MenuItem";

interface Props {
  items: MenuItemType[];
  menuItemColor?: string;
}

export default function MenuitemList({ items, menuItemColor }: Props) {
  return (
    <>
      {items.map(([label, linkUrl]) => (
        <Link href={linkUrl} key={label}>
          <MenuItem text={label} color={menuItemColor} />
        </Link>
      ))}
    </>
  );
}
