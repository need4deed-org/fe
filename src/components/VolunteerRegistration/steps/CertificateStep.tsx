"use client";

import { ErrorMessage, FormInput } from "@/components/core/common";
import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { EditableField } from "@/components/EditableField/EditableField";
import { useForm } from "@tanstack/react-form";
import { ApiOptionLists } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper } from "../styled";
import { ProfileCompletionData } from "../types";

type Props = {
  form: ReturnType<typeof useForm<ProfileCompletionData>>;
  optionLists?: ApiOptionLists;
};

export function CertificateStep({ form, optionLists }: Props) {
  const { t } = useTranslation();
  const leadFrom = optionLists?.lead_from ?? [];
  const leadFromMapping = createMapping(optionLists?.lead_from as ApiLanguageOption[]);

  return (
    <div>
      <form.Field
        name="goodConductCertificate"
        validators={{
          onChange: ({ value }) => (!value ? t("form.error.required") : undefined),
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.certOfGoodConduct.header")}</FieldLabel>
            <EditableField
              mode="edit"
              type="radio-list"
              value={field.state.value || ""}
              setValue={(value) => field.handleChange(value as string)}
              options={[
                t("form.becomeVolunteer.fields.certOfGoodConduct.true"),
                t("form.becomeVolunteer.fields.certOfGoodConduct.false"),
              ]}
              errorMessage={field.state.meta.errors.join(", ")}
            />
            <h6>
              <a href="https://www.berlin.de/laf/engagement/fuehrungszeugnis/" target="_blank" rel="noreferrer">
                {t("form.becomeVolunteer.fields.certOfGoodConduct.why")}
              </a>
            </h6>
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field
        name="measlesVaccination"
        validators={{
          onChange: ({ value }) => (!value ? t("form.error.required") : undefined),
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.certMeaslesVaccination.header")}</FieldLabel>
            <EditableField
              mode="edit"
              type="radio-list"
              value={field.state.value || ""}
              setValue={(value) => field.handleChange(value as string)}
              options={[
                t("volunteerRegistration.fields.certMeaslesVaccination.true"),
                t("volunteerRegistration.fields.certMeaslesVaccination.false"),
              ]}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field name="leadFrom">
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.leadFrom")}</FieldLabel>
            <EditableField
              mode="edit"
              type="checkbox-list"
              value={(field.state.value || []).map((lead) => leadFromMapping.idToTitle[lead])}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                const mappedIds = labels.map((val) => leadFromMapping.titleToId[val]);
                field.handleChange(mappedIds);
              }}
              options={leadFrom?.map((a) => a.title)}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field name="comments">
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.comments")}</FieldLabel>
            <FormInput value={field.state.value || ""} onInputChange={(v) => field.handleChange(v)} placeHolder="" />
            {field.state.meta.errors.length > 0 && <ErrorMessage message={field.state.meta.errors.join(", ")} />}
          </FieldWrapper>
        )}
      </form.Field>
    </div>
  );
}
