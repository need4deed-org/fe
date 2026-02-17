"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createAgentContactDetailsSchema, AgentContactDetailsFormData } from "./agentContactDetailsSchema";
import { useUpdateAgentContact } from "@/hooks/useUpdateAgentContact";
import { AgentRoles } from "@/config/constants";
import { ApiAgentProfileGet } from "../../../types";
import { AgentContactDetailsDisplay } from "./AgentContactDetailsDisplay";
import { AgentContactDetailsEdit } from "./AgentContactDetailsEdit";
import { FormContainer } from "../../shared/styles";
import { useEnumTranslation } from "../shared";

type Props = {
  agent: ApiAgentProfileGet;
};

export type ContactDetailsRef = {
  handleEditClick: () => void;
};

const roleKeys = Object.values(AgentRoles);

export const AgentContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails({ agent }, ref) {
  const { t } = useTranslation();
  const { mutate: updateAgent, isPending } = useUpdateAgentContact(String(agent?.id));
  const [isEditing, setIsEditing] = useState(false);

  const { options, keysToLabels, labelsToKeys } = useEnumTranslation(
    roleKeys,
    "dashboard.agentProfile.contactDetails.roles",
  );

  const schema = createAgentContactDetailsSchema(t);

  const initialFormValues = agent?.contactDetails;

  const methods = useForm<AgentContactDetailsFormData>({
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

  const onSubmit = (values: AgentContactDetailsFormData) => {
    updateAgent(
      {
        contactDetails: {
          ...values,
        },
      },
      {
        onSuccess: () => {
          handleCancel();
        },
      },
    );
  };

  // Reset form when person data changes (after successful mutation & refetch)
  useEffect(() => {
    if (!isEditing) {
      reset(initialFormValues);
    }
  }, [initialFormValues, isEditing, reset]);
  return (
    <FormProvider {...methods}>
      <FormContainer $isEditing={isEditing}>
        {isEditing ? (
          <AgentContactDetailsEdit
            options={options}
            keysToLabels={keysToLabels}
            labelsToKeys={labelsToKeys}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <AgentContactDetailsDisplay keysToLabels={keysToLabels} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
