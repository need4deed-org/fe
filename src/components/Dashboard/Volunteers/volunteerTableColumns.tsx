import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";
import { COLUMN_WIDTH } from "../common/EntityTableList/columnWidths";
import { ReactNode } from "react";
import DropdownAccordionFilter from "../common/DropDownFilter/DropdownAccordionFilter";
import { FilterItem } from "../common/CardsFilter/types";
import { LanguageMatch } from "need4deed-sdk";
import { Menu } from "@/components/core/menu";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { FlexColumn } from "@/components/styled/FlexColumn";
import { Paragraph } from "@/components/styled/text";

const FULL_WIDTHS = {
  name: COLUMN_WIDTH.SM,
  type: COLUMN_WIDTH.LG,
  engagement: COLUMN_WIDTH.XXXL,
  matching: COLUMN_WIDTH.SM,
  language: COLUMN_WIDTH.MD,
  district: COLUMN_WIDTH.SM,
  email: COLUMN_WIDTH.XXXL,
};
const RESTRICTED_WIDTHS = {
  ...FULL_WIDTHS,
  name: COLUMN_WIDTH.LG,
  type: COLUMN_WIDTH.XXXL,
  matching: COLUMN_WIDTH.XXL,
  language: COLUMN_WIDTH.LG,
};

export const getVolunteerColWidths = (canSeeContactColumns: boolean) =>
  canSeeContactColumns ? FULL_WIDTHS : RESTRICTED_WIDTHS;

export const createVolunteerTableColumns = (
  t: TFunction,
  copyButton: ReactNode,
  canSeeContactColumns: boolean,
  dropdownFilters: {
    districtFilters: FilterItem[];
    engagementFilters: FilterItem[];
    languageFilters: FilterItem[];
    matchAllLanguages: boolean;
    setMatchAllLanguages: (value: boolean) => void;
    typeFilters: FilterItem[];
  },
): Column[] => {
  const VOLUNTEER_COL_WIDTHS = getVolunteerColWidths(canSeeContactColumns);
  const matchMode = dropdownFilters.matchAllLanguages ? LanguageMatch.ALL : LanguageMatch.ANY;
  const matchLabel = t("dashboard.volunteers.languageMatch.label");
  const matchOption = (mode: LanguageMatch) => t(`dashboard.volunteers.languageMatch.${mode}`);

  const columns: Column[] = [
    { key: "name", label: t("dashboard.volunteers.table.name"), width: VOLUNTEER_COL_WIDTHS.name },
    {
      key: "type",
      label: t("dashboard.volunteers.table.type"),
      width: VOLUNTEER_COL_WIDTHS.type,
      headerAction: <DropdownAccordionFilter items={dropdownFilters.typeFilters} />,
    },
    {
      key: "engagement",
      label: t("dashboard.volunteers.table.engagementStatus"),
      width: VOLUNTEER_COL_WIDTHS.engagement,
      headerAction: <DropdownAccordionFilter items={dropdownFilters.engagementFilters} />,
    },
    { key: "matching", label: t("dashboard.volunteers.table.matchingStatus"), width: VOLUNTEER_COL_WIDTHS.matching },
    {
      key: "language",
      label: t("dashboard.volunteers.table.language"),
      width: VOLUNTEER_COL_WIDTHS.language,
      headerAction: (
        <DropdownAccordionFilter
          items={dropdownFilters.languageFilters}
          triggerLabel={t("dashboard.volunteers.table.language")}
          beforeItems={
            <FlexColumn $gap="var(--spacing-8)" style={{ marginBlockEnd: "var(--spacing-8)" }}>
              <Paragraph
                aria-hidden="true"
                fontSize="var(--checkbox-label-font-size)"
                fontWeight="var(--font-weight-regular)"
              >
                {t("dashboard.volunteers.languageMatch.label")}
              </Paragraph>
              <Menu inFlow>
                <Menu.Target label={`${matchLabel}: ${matchOption(matchMode)}`}>
                  <Paragraph
                    as="span"
                    fontSize="var(--checkbox-label-font-size)"
                    fontWeight="var(--font-weight-regular)"
                  >
                    {matchOption(matchMode)}
                  </Paragraph>
                  <CaretDownIcon size={16} aria-hidden />
                </Menu.Target>
                <Menu.Dropdown inFlow>
                  {[LanguageMatch.ANY, LanguageMatch.ALL].map((mode) => (
                    <Menu.Item
                      key={mode}
                      onSelect={() => dropdownFilters.setMatchAllLanguages(mode === LanguageMatch.ALL)}
                    >
                      <Paragraph
                        as="span"
                        fontSize="var(--checkbox-label-font-size)"
                        fontWeight="var(--font-weight-regular)"
                      >
                        {matchOption(mode)}
                      </Paragraph>
                      {mode === matchMode ? <CheckIcon size={16} aria-hidden /> : null}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </FlexColumn>
          }
        />
      ),
    },
    {
      key: "district",
      label: t("dashboard.volunteers.table.district"),
      width: VOLUNTEER_COL_WIDTHS.district,
      headerAction: <DropdownAccordionFilter items={dropdownFilters.districtFilters} />,
    },
  ];

  if (canSeeContactColumns) {
    columns.push({
      key: "email",
      label: t("dashboard.volunteers.table.email"),
      width: VOLUNTEER_COL_WIDTHS.email,
      headerAction: copyButton,
    });
  }

  return columns;
};
