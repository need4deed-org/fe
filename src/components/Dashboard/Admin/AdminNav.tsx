"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { routes } from "@/constants/routes";

export function AdminNav() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const pathname = usePathname();

  const NAV_ITEMS = [
    { route: routes.domains(language), labelKey: "dashboard.admin.nav.domains" },
    { route: routes.statistics(language), labelKey: "dashboard.admin.nav.stats" },
    { route: routes.ngoVolunteers(language), labelKey: "dashboard.admin.nav.ngoVolunteers" },
  ];

  return (
    <Nav aria-label={t("dashboard.admin.title")}>
      {NAV_ITEMS.map(({ route, labelKey }) => {
        const isActive = pathname === route || pathname.startsWith(`${route}/`);

        return (
          <NavLink key={route} href={route} aria-current={isActive ? "page" : undefined} $isActive={isActive}>
            {t(labelKey)}
          </NavLink>
        );
      })}
    </Nav>
  );
}

export default AdminNav;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  padding: var(--spacing-8) var(--spacing-16);
  border-radius: var(--button-border-radius);
  border: 1px solid var(--color-orchid);
  background: ${({ $isActive }) => ($isActive ? "var(--color-orchid)" : "transparent")};
  color: var(--color-midnight);
  font-size: var(--text-p-font-size);
  font-weight: var(--font-weight-semi-bold);
  text-decoration: none;

  &:hover {
    background: var(--color-orchid-subtle);
  }
`;
