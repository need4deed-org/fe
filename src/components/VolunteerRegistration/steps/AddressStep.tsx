"use client";

import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { EditableField } from "@/components/EditableField/EditableField";
import { ErrorMessage, FormInput } from "@/components/core/common";
import { ApiOptionLists } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper } from "../styled";
import { ProfileCompletionData } from "../types";
import { useForm } from "@tanstack/react-form";

type Props = {
  form: ReturnType<typeof useForm<ProfileCompletionData>>;
  optionLists?: ApiOptionLists;
};

export function AddressStep({ form, optionLists }: Props) {
  const { t } = useTranslation();

  const locations = optionLists?.district;
  const locationMapping = createMapping(optionLists?.district as ApiLanguageOption[]);

  return (
    <div>
      <form.Field
        name="addressPostcode"
        validators={{
          onChange: ({ value }) => (!value ? t("form.error.required") : undefined),
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.postcode")}</FieldLabel>
            <FormInput
              value={field.state.value || ""}
              onInputChange={(v) => field.handleChange(v)}
              placeHolder="12345"
            />
            {field.state.meta.errors.length > 0 && <ErrorMessage message={field.state.meta.errors.join(", ")} />}
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field
        name="locations"
        // validators={{ onChange: ({ value }) => (value.length === 0 ? t("form.error.required") : undefined) }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.locations.header")}</FieldLabel>
            <EditableField
              mode="edit"
              type="checkbox-list"
              value={(field.state.value || []).map((location) => locationMapping.idToTitle[location])}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                const mappedIds = labels.map((val) => locationMapping.titleToId[val]);
                field.handleChange(mappedIds);
              }}
              options={locations?.map((a) => a.title)}
            />
            {field.state.meta.errors.length > 0 && <ErrorMessage message={field.state.meta.errors.join(", ")} />}
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field
        name="languages"
        validators={{
          onBlur: ({ value }) => (!value[0].language || !value[0].level ? t("form.error.required") : undefined),
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.languages.header")}</FieldLabel>
            <LanguageFields languages={field.state.value || []} t={t} onChange={(e) => field.handleChange(e)} />
            {field.state.meta.errors.length > 0 && (
              <ErrorMessage
                message={field.state.meta.errors.join(", ")}
                paddingLeft="calc(var(--editableField-fieldWrapper-label-width) + var(--editableField-fieldWrapper-gap))"
              />
            )}
          </FieldWrapper>
        )}
      </form.Field>
    </div>
  );
}
