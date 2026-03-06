import Image from "next/image";
import styled from "styled-components";
import { ShootingStarIcon, XIcon } from "@phosphor-icons/react";
import { Paragraph } from "@/components/styled/text";

type Props = {
  name: string;
  avatarUrl?: string;
  onRemove: () => void;
};

export function OpportunityFilterChip({ name, avatarUrl, onRemove }: Props) {
  return (
    <OpportunityChip data-testid="opportunity-filter-chip">
      <AvatarWrapper>
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill style={{ objectFit: "cover" }} />
        ) : (
          <DefaultAvatarWrapper>
            <ShootingStarIcon
              size={16}
              color="var(--opportunity-filter-chip-default-avatar-icon-color)"
              weight="duotone"
            />
          </DefaultAvatarWrapper>
        )}
      </AvatarWrapper>
      <Paragraph
        color="var(--color-white)"
        fontSize="var(--cards-header-filter-item-font-size)"
        fontWeight="var(--cards-header-filter-item-font-weight)"
      >
        {name}
      </Paragraph>
      <XIconDiv onClick={onRemove}>
        <XIcon size={20} color="var(--color-white)" />
      </XIconDiv>
    </OpportunityChip>
  );
}

const AvatarWrapper = styled.div`
  position: relative;
  width: var(--opportunity-filter-chip-avatar-size);
  height: var(--opportunity-filter-chip-avatar-size);
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const DefaultAvatarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--opportunity-filter-chip-default-avatar-bg);
`;

const OpportunityChip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: var(--cards-header-filter-item-height);
  gap: var(--cards-header-filter-item-gap);
  border-radius: var(--cards-header-filter-item-border-radius);
  padding: var(--cards-header-filter-item-padding);
  background-color: var(--opportunity-filter-chip-bg);
`;

const XIconDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--cards-header-filter-item-icon-div-size);
  height: var(--cards-header-filter-item-icon-div-size);
  border-radius: var(--cards-header-filter-item-icon-div-border-radius);
  cursor: pointer;

  &:hover {
    background-color: var(--opportunity-filter-chip-x-hover-bg);
  }
`;
