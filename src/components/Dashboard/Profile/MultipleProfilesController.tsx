import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { sortAgentOptions } from "@/utils/agent-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import ProfileLayout from "./ProfileLayout";
import { ProfileNavigation, ProfileNavigationDirection } from "./types";

export const NGO_PROFILE_PARAM = "ngo";

type Props = {
  agentIds: Array<number>;
  showList: boolean;
};

export const MultipleProfilesController = ({ agentIds, showList }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { currentAgents } = useGetCurrentAgent();

  const requestedId = Number(searchParams.get(NGO_PROFILE_PARAM));
  const currentIndex = Math.max(agentIds.indexOf(requestedId), 0);
  const selectedId = agentIds[currentIndex];

  const onSelect = useCallback(
    (id: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(NGO_PROFILE_PARAM, String(id));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const options = showList ? sortAgentOptions(agentIds, currentAgents) : [];

  const stepOrder = showList ? options.map(({ id }) => id) : agentIds;

  const onStep = useCallback(
    (direction: ProfileNavigationDirection) => {
      const step = direction === ProfileNavigationDirection.LEFT ? -1 : 1;
      const index = Math.max(stepOrder.indexOf(selectedId), 0);
      onSelect(stepOrder[(index + step + stepOrder.length) % stepOrder.length]);
    },
    [onSelect, selectedId, stepOrder],
  );

  const profileNavigation: ProfileNavigation = { options, selectedId, onSelect, onStep };

  return <ProfileLayout entityId={String(selectedId)} entityType="agent" profileNavigation={profileNavigation} />;
};
