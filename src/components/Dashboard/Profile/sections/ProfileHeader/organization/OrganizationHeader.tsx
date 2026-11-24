"use client";
import { HouseIcon } from "@phosphor-icons/react";
import { ApiOrganizationGet } from "need4deed-sdk";
import { HeaderCard, IconContainer } from "../common";

type Props = {
  organization: ApiOrganizationGet;
};

export const OrganizationHeader = ({ organization }: Props) => {
  return (
    <HeaderCard
      testId="organization-header"
      avatar={
        <IconContainer data-testid="organization-header-icon">
          <HouseIcon size={120} color="var(--color-blue-500)" weight="duotone" />
        </IconContainer>
      }
      title={organization.title}
      subtitle={organization.website || undefined}
    />
  );
};
