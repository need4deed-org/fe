"use client";

import { useUpdateOrganization } from "@/hooks/useUpdateOrganizationDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOrganizationGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../../shared/types";
import { useEditingChangeNotifier } from "../../shared/useEditingChangeNotifier";
import { OrganizationContactDetailsDisplay } from "./OrganizationContactDetailsDisplay";
import { OrganizationContactDetailsEdit } from "./OrganizationContactDetailsEdit";
import {
  createOrganizationContactDetailsSchema,
  OrganizationContactDetailsFormData,
} from "./organizationContactDetailsSchema";

type Props = {
  organization: ApiOrganizationGet;
} & EditableSectionProps;

export const OrganizationContactDetails = forwardRef<EditableSectionRef, Props>(function OrganizationContactDetails(
  { organization, onEditingChange },
  ref,
) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateOrganization, isPending } = useUpdateOrganization(
    String(organization.id),
    "dashboard.organizationProfile.contactDetails.saveSuccess",
  );

  useEditingChangeNotifier(isEditing, onEditingChange);

  const schema = createOrganizationContactDetailsSchema(t);

  const initialFormValues = useMemo(
    (): OrganizationContactDetailsFormData => ({
      email: organization.email ?? "",
      phone: organization.phone ?? "",
    }),
    [organization.email, organization.phone],
  );

  const methods = useForm<OrganizationContactDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const { handleSubmit, reset } = methods;

  const handleEditClick = () => setIsEditing(true);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  useEffect(() => {
    if (isEditing) return;
    reset(initialFormValues);
  }, [initialFormValues, isEditing, reset]);

  const handleCancel = () => {
    reset(initialFormValues);
    setIsEditing(false);
  };

  const onSubmit = (values: OrganizationContactDetailsFormData) => {
    updateOrganization(
      {
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
      },
      {
        onSuccess: () => {
          reset(values);
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="organization-contact-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <OrganizationContactDetailsEdit
            contacts={organization.contacts ?? []}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <OrganizationContactDetailsDisplay contacts={organization.contacts ?? []} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
