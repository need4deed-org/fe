import Image from "next/image";
import { ShootingStarIcon, XIcon } from "@phosphor-icons/react";
import { Paragraph } from "@/components/styled/text";
import { AvatarWrapper, DefaultAvatarWrapper, EntityChip, EntityChipXIconDiv } from "./styles";

type Props = {
  name: string;
  avatarUrl?: string;
  onRemove: () => void;
};

export function EntityFilterChip({ name, avatarUrl, onRemove }: Props) {
  return (
    <EntityChip data-testid="entity-filter-chip">
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
      <EntityChipXIconDiv onClick={onRemove}>
        <XIcon size={20} color="var(--color-white)" />
      </EntityChipXIconDiv>
    </EntityChip>
  );
}
