"use client";

import { Paragraph } from "@/components/styled/text";
import { ApiEmailTemplatePlaceholder } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { placeholderSnippet } from "./helpers";

type Props = {
  placeholders: ApiEmailTemplatePlaceholder[];
  disabled: boolean;
  onInsert: (name: string) => void;
};

export function PlaceholderChips({ placeholders, disabled, onInsert }: Props) {
  const { t } = useTranslation();
  if (placeholders.length === 0) return null;

  return (
    <Container>
      <Title id="email-template-placeholders">{t("dashboard.admin.emailTemplates.placeholders")}</Title>
      <Paragraph color="var(--color-grey-500)">
        {t(
          disabled
            ? "dashboard.admin.emailTemplates.placeholdersReadOnlyHint"
            : "dashboard.admin.emailTemplates.placeholdersHint",
        )}
      </Paragraph>
      <Chips role="group" aria-labelledby="email-template-placeholders">
        {placeholders.map(({ name, required }) => (
          <Chip
            key={name}
            type="button"
            disabled={disabled}
            $required={required}
            title={required ? t("dashboard.admin.emailTemplates.placeholderRequired") : undefined}
            aria-label={t(
              required
                ? "dashboard.admin.emailTemplates.insertRequiredPlaceholder"
                : "dashboard.admin.emailTemplates.insertPlaceholder",
              { name },
            )}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onInsert(name)}
          >
            {placeholderSnippet(name)}
            {required && <span aria-hidden> *</span>}
          </Chip>
        ))}
      </Chips>
      {placeholders.some(({ required }) => required) && (
        <Paragraph color="var(--color-grey-500)">
          {t("dashboard.admin.emailTemplates.placeholderRequiredLegend")}
        </Paragraph>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
`;

const Title = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-midnight);
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

const Chip = styled.button<{ $required: boolean }>`
  padding: var(--spacing-4) var(--spacing-12);
  border-radius: var(--button-border-radius);
  border: 1px solid ${({ $required }) => ($required ? "var(--color-midnight)" : "var(--color-grey-200)")};
  background: var(--color-white);
  color: var(--color-midnight);
  font-family: monospace;
  font-size: var(--font-size-sm);
  font-weight: ${({ $required }) => ($required ? "var(--font-weight-bold)" : "var(--font-weight-regular)")};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-orchid-subtle);
  }

  &:disabled {
    cursor: default;
  }
`;
