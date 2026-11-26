import { EditableField } from "@/components/EditableField/EditableField";
import { DashboardRoutes } from "@/config/constants";
import { ApiAgentOrganization } from "need4deed-sdk";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FieldWrapper, FormDetails } from "../shared/styles";
import { OrganisationDetailsFormData } from "./agentOrganisationDetailsSchema";
import { clientLanguagesToDisplay } from "./formatters";

const i18nPrefix = "dashboard.agentProfile.organisationDetails";

const OperatorLink = styled(Link)`
  color: var(--color-blue-700);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

type Props = {
  rawClientLanguages?: Array<{ id: number; title: string }>;
  address?: string;
  organization?: ApiAgentOrganization | null;
};

export const OrganisationDetailsDisplay = ({ rawClientLanguages, address, organization }: Props) => {
  const { t, i18n } = useTranslation();
  const { watch } = useFormContext<OrganisationDetailsFormData>();
  const values = watch();

  return (
    <FormDetails data-testid="organisation-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.ngoTitle`)}
        value={values.title}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.about`)}
        value={values.about}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.website`)}
        value={values.website ?? ""}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.address`)}
        value={address || "—"}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.organisationType`)}
        value={values.organizationType}
        setValue={() => {}}
      />
      {organization ? (
        <FieldWrapper data-testid="agent-operator-link">
          <label>{t(`${i18nPrefix}.operator`)}</label>
          <span>
            <OperatorLink href={`/${i18n.language}${DashboardRoutes.Organizations}/${organization.id}`}>
              {organization.title || values.operator}
            </OperatorLink>
          </span>
        </FieldWrapper>
      ) : (
        <EditableField
          mode="display"
          type="text"
          label={t(`${i18nPrefix}.operator`)}
          value={values.operator}
          setValue={() => {}}
        />
      )}
      <EditableField
        mode="display"
        type="checkbox-list"
        label={t(`${i18nPrefix}.services`)}
        value={values.services}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.clientLanguages`)}
        value={clientLanguagesToDisplay(rawClientLanguages)}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.sharesVolunteers`)}
        value={t(`${i18nPrefix}.${values.sharesVolunteers ? "sharesVolunteersYes" : "sharesVolunteersNo"}`)}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
