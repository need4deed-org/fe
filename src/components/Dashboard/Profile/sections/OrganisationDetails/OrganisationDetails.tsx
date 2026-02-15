"use client";
import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { useApiLanguages } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../shared/styles";
import { EditableSectionRef } from "../shared/types";
import { apiLanguagesToFormValues, toLanguagesForForm } from "./formatters";
import { createOrganisationDetailsSchema, OrganisationDetailsFormData } from "./organisationDetailsSchema";
import { OrganisationDetailsDisplay } from "./OrganisationDetailsDisplay";
import { OrganisationDetailsEdit } from "./OrganisationDetailsEdit";

type Props = {
  agent: ApiAgentProfileGet;
};

export const OrganisationDetails = forwardRef<EditableSectionRef, Props>(function OrganisationDetails({ agent }, ref) {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { data: apiLanguages } = useApiLanguages();

  const details = agent.organisationDetails;
  const languagesForForm = toLanguagesForForm(apiLanguages, i18n.language);
  const schema = createOrganisationDetailsSchema(t);

  const initialFormValues = {
    ...details,
    clientLanguages: apiLanguagesToFormValues(details?.clientLanguages),
  };

  const methods = useForm<OrganisationDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const { handleSubmit, reset } = methods;

  const handleEditClick = () => setIsEditing(true);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = () => {
    setIsEditing(false);
  };

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="organisation-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <OrganisationDetailsEdit
            languagesForForm={languagesForForm}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
          />
        ) : (
          <OrganisationDetailsDisplay rawClientLanguages={details?.clientLanguages} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
