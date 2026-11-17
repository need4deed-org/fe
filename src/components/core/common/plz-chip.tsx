import { Paragraph } from "@/components/styled/text";
import { PLZCheckStatus } from "@/utils/plz-check";
import { TransitionEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import { ErrorMessage } from "./ErrorMessage";

const slideOpen = keyframes`
  from {
    grid-template-rows: 0fr;
  }
`;

const SlideContainer = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
  transition: grid-template-rows var(--plz-chip-transition-duration) ease-out;
  animation: ${slideOpen} var(--plz-chip-transition-duration) ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
    animation: none;
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

const LiveRegion = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

type Props = {
  status: PLZCheckStatus;
};

type ChipMessage = "checking" | "unknown";

export function PLZChip({ status }: Props) {
  const { t } = useTranslation();
  const message: ChipMessage | null = status === "checking" || status === "unknown" ? status : null;
  const [shownMessage, setShownMessage] = useState<ChipMessage | null>(message);
  if (message && message !== shownMessage) setShownMessage(message);

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && message === null) setShownMessage(null);
  };

  return (
    <>
      <LiveRegion role="status">{message === "unknown" ? t("form.error.postcodeUnknown") : ""}</LiveRegion>
      {shownMessage && (
        <SlideContainer
          $isOpen={message !== null}
          onTransitionEnd={handleTransitionEnd}
          aria-hidden
          data-testid="plz-chip"
        >
          <SlideContent>
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
      )}
    </>
  );
}
