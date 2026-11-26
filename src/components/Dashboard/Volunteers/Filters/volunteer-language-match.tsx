import { TFunction } from "i18next";
import { LanguageMatch } from "need4deed-sdk";
import { Menu } from "@/components/core/menu";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { FlexColumn } from "@/components/styled/FlexColumn";
import { Paragraph } from "@/components/styled/text";

interface Props {
  matchAllLanguages: boolean;
  setMatchAllLanguages: (value: boolean) => void;
  t: TFunction;
}

export function VolunteerLanguageMatch({ matchAllLanguages, setMatchAllLanguages, t }: Props) {
  const matchMode = matchAllLanguages ? LanguageMatch.ALL : LanguageMatch.ANY;
  const matchLabel = t("dashboard.volunteers.languageMatch.label");
  const matchOption = (mode: LanguageMatch) => t(`dashboard.volunteers.languageMatch.${mode}`);

  return (
    <FlexColumn $gap="var(--spacing-8)" style={{ marginBlockEnd: "var(--spacing-8)" }}>
      <Paragraph aria-hidden="true" fontSize="var(--checkbox-label-font-size)" fontWeight="var(--font-weight-regular)">
        {matchLabel}
      </Paragraph>
      <Menu inFlow>
        <Menu.Target label={`${matchLabel}: ${matchOption(matchMode)}`}>
          <Paragraph as="span" fontSize="var(--checkbox-label-font-size)" fontWeight="var(--font-weight-regular)">
            {matchOption(matchMode)}
          </Paragraph>
          <CaretDownIcon size={16} aria-hidden />
        </Menu.Target>
        <Menu.Dropdown inFlow>
          {[LanguageMatch.ANY, LanguageMatch.ALL].map((mode) => (
            <Menu.Item key={mode} onSelect={() => setMatchAllLanguages(mode === LanguageMatch.ALL)}>
              <Paragraph as="span" fontSize="var(--checkbox-label-font-size)" fontWeight="var(--font-weight-regular)">
                {matchOption(mode)}
              </Paragraph>
              {mode === matchMode ? <CheckIcon size={16} aria-hidden /> : null}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </FlexColumn>
  );
}
