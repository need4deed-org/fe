import { Paragraph } from "@/components/styled/text";
import { PLZCheckStatus } from "@/utils/openplz";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const SlideContainer = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
  transition: grid-template-rows var(--plz-chip-transition-duration) ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const SlideContent = styled.div`
  overflow: hidden;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--plz-chip-gap);
  margin-top: var(--plz-chip-margin-top);
  padding: var(--plz-chip-padding);
  border-radius: var(--plz-chip-border-radius);
  background-color: var(--plz-chip-bg);
`;

type Props = {
  status: PLZCheckStatus;
};

export function PLZChip({ status }: Props) {
  const { t } = useTranslation();
  const isOpen = status === "unknown";

  return (
    <SlideContainer $isOpen={isOpen} role="status" aria-live="polite" data-testid="plz-chip">
      <SlideContent>
        {isOpen && (
          <Chip>
            <WarningCircleIcon aria-hidden="true" size={20} color="var(--plz-chip-color)" />
            <Paragraph
              color="var(--plz-chip-color)"
              fontSize="var(--form-input-error-message-fontSize)"
              fontWeight="var(--form-input-error-message-fontWeight)"
              lineheight="var(--form-input-error-message-lineHeight)"
            >
              {t("form.error.postcodeUnknown")}
            </Paragraph>
          </Chip>
        )}
      </SlideContent>
    </SlideContainer>
  );
}
