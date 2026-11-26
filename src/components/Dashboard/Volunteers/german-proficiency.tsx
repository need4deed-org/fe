import { LangProficiency } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const markers = {
  fluent: { symbol: "✓", background: "var(--color-green-200)" },
  belowFluent: { symbol: "○", background: "var(--color-grey-50)" },
} as const;

const Marker = styled.span<{ $level: keyof typeof markers }>`
  background: ${({ $level }) => markers[$level].background};
  color: var(--color-grey-700);
  border-radius: var(--border-radius-xs);
  padding-inline: 0.25em;
`;

const Legend = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8) var(--spacing-16);
  margin: 0;
  padding: var(--spacing-8) var(--spacing-16);
  border-top: var(--border-width-thin) solid var(--color-blue-50);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  color: var(--color-grey-700);
`;

export function GermanProficiencyMarker({ proficiency }: { proficiency: LangProficiency }) {
  const { t } = useTranslation();
  const level =
    proficiency === LangProficiency.NATIVE || proficiency === LangProficiency.FLUENT ? "fluent" : "belowFluent";
  const label = t(`dashboard.volunteers.langProficiency.${proficiency}`);

  return (
    <Marker $level={level} role="img" aria-label={label} title={label}>
      {markers[level].symbol}
    </Marker>
  );
}

export function GermanProficiencyLegend() {
  const { t } = useTranslation();
  return (
    <Legend>
      <span>{t("dashboard.volunteers.germanProficiency.label")}</span>
      {(["fluent", "belowFluent"] as const).map((level) => (
        <span key={level}>
          <Marker $level={level} aria-hidden="true">
            {markers[level].symbol}
          </Marker>{" "}
          {t(`dashboard.volunteers.germanProficiency.${level}`)}
        </span>
      ))}
    </Legend>
  );
}
