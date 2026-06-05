"use client";
import { useUpdateOpportunityContact } from "@/hooks/useUpdateOpportunityContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../../shared/types";
import { useEditingChangeNotifier } from "../../shared/useEditingChangeNotifier";
import { OpportunityContactDetailsDisplay } from "./OpportunityContactDetailsDisplay";
import { OpportunityContactDetailsEdit } from "./OpportunityContactDetailsEdit";
import {
  createOpportunityContactDetailsSchema,
  OpportunityContactDetailsFormData,
} from "./opportunityContactDetailsSchema";

type Props = {
  opportunity: ApiOpportunityGet;
} & EditableSectionProps;

export const OpportunityContactDetails = forwardRef<EditableSectionRef, Props>(function OpportunityContactDetails(
  { opportunity, onEditingChange },
  ref,
) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const schema = createOpportunityContactDetailsSchema(t);

  const { contact } = opportunity;

  const { mutate: updateContact, isPending } = useUpdateOpportunityContact(opportunity.id);

  const initialFormValues = useMemo(
    (): OpportunityContactDetailsFormData => ({
      name: contact?.name ?? "",
      phone: contact?.phone ?? "",
      email: contact?.email ?? "",
    }),
    [contact],
  );

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
          id: contact?.id,
          name: values.name,
          phone: values.phone,
          email: values.email,
          waysToContact: contact?.waysToContact,
        },
      },
      {
        onSuccess: () => {
          reset(values);
          setIsEditing(false);
        },
      },
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
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <OpportunityContactDetailsDisplay />
        )}
      </FormContainer>
    </FormProvider>
  );
});
