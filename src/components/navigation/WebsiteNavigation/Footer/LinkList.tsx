import styled from "styled-components";
import { Link as LinkType } from "@/types/Link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

type LinkListProps = {
  links: LinkType[];
};

export const LinkList = ({ links }: LinkListProps) => {
  const pathname = usePathname();

  return (
    <List>
      {links.map(({ route, label }) => (
        <ListItem key={route}>
          <Link href={route} $selected={pathname.startsWith(route)}>
            {label}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

const List = styled.ul`
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
`;

const ListItem = styled.li``;

const Link = styled(NextLink)<{ $selected: boolean }>`
  color: var(--misty-lavender);
  text-decoration: ${({ $selected }) => ($selected ? "underline" : "none")};
`;
