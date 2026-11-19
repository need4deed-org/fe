import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ShootingStarIcon, XIcon } from "@phosphor-icons/react";
import { Paragraph } from "@/components/styled/text";
import { AvatarWrapper, DefaultAvatarWrapper, EntityChip, RemoveEntityFilterButton } from "./styles";

type Props = {
  name: string;
  avatarUrl?: string;
  onRemove: () => void;
};

export function EntityFilterChip({ name, avatarUrl, onRemove }: Props) {
  const { t } = useTranslation();

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
      <RemoveEntityFilterButton
        type="button"
        aria-label={t("dashboard.filters.remove", { label: name })}
        onClick={onRemove}
      >
        <XIcon size={20} aria-hidden />
      </RemoveEntityFilterButton>
    </EntityChip>
  );
}
