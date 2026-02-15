"use client";
import { useUpdateOpportunityContact } from "@/hooks/useUpdateOpportunityContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet, PreferredCommunicationType } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../../shared/styles";
import { EditableSectionRef } from "../../shared/types";
import { useEnumTranslation } from "../shared";
import {
  createOpportunityContactDetailsSchema,
  OpportunityContactDetailsFormData,
} from "./opportunityContactDetailsSchema";
import { OpportunityContactDetailsDisplay } from "./OpportunityContactDetailsDisplay";
import { OpportunityContactDetailsEdit } from "./OpportunityContactDetailsEdit";

type Props = {
  opportunity: ApiOpportunityGet;
};

const COMMUNICATION_TYPES = Object.values(PreferredCommunicationType);

export const OpportunityContactDetails = forwardRef<EditableSectionRef, Props>(function OpportunityContactDetails(
  { opportunity },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateOpportunityContact(opportunity.id);
  const [isEditing, setIsEditing] = useState(false);

  const { options, keysToLabels, labelsToKeys } = useEnumTranslation(
    COMMUNICATION_TYPES,
    "dashboard.opportunityProfile.contactDetails.waysToContact",
  );

  const schema = createOpportunityContactDetailsSchema(t);

  const initialFormValues = opportunity.contact;

  const methods = useForm<OpportunityContactDetailsFormData>({
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

  const onSubmit = (values: OpportunityContactDetailsFormData) => {
    updateContact(
      {
        contact: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          waysToContact: values.waysToContact,
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  useEffect(() => {
    if (!isEditing) {
      reset(initialFormValues);
    }
  }, [initialFormValues, isEditing, reset]);

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="opportunity-contact-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <OpportunityContactDetailsEdit
            options={options}
            keysToLabels={keysToLabels}
            labelsToKeys={labelsToKeys}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <OpportunityContactDetailsDisplay keysToLabels={keysToLabels} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
