import { Paragraph } from "@/components/styled/text";
import { PLZCheckStatus } from "@/utils/plz-check";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ErrorMessage } from "./ErrorMessage";

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
  margin-top: var(--plz-chip-margin-top);
  padding: var(--plz-chip-padding);
  border-radius: var(--plz-chip-border-radius);
  background-color: var(--plz-chip-bg);

  & > * {
    margin-top: 0;
  }
`;

type Props = {
  status: PLZCheckStatus;
};

type ChipMessage = "checking" | "unknown";

export function PLZChip({ status }: Props) {
  const { t } = useTranslation();
  const message: ChipMessage | null = status === "checking" || status === "unknown" ? status : null;
  const [lastMessage, setLastMessage] = useState<ChipMessage | null>(message);
  if (message && message !== lastMessage) setLastMessage(message);
  const shownMessage = message ?? lastMessage;

  return (
    <SlideContainer $isOpen={message !== null} role="status" aria-live="polite" data-testid="plz-chip">
      <SlideContent aria-hidden={message === null}>
        {shownMessage === "checking" && (
          <Paragraph
            margin="var(--plz-chip-margin-top) 0 0"
            color="var(--plz-chip-checking-color)"
            fontSize="var(--form-input-error-message-fontSize)"
            fontWeight="var(--form-input-error-message-fontWeight)"
            lineheight="var(--form-input-error-message-lineHeight)"
          >
            {t("form.postcodeChecking")}
          </Paragraph>
        )}
        {shownMessage === "unknown" && (
          <Chip>
            <ErrorMessage message={t("form.error.postcodeUnknown")} />
          </Chip>
        )}
      </SlideContent>
    </SlideContainer>
  );
}
