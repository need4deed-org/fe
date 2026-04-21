"use client";

import { AgentRoles } from "@/config/constants";
import { useUpdateAgentContact } from "@/hooks/useUpdateAgentContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ApiAgentProfileGet } from "../../../types";
import { FormContainer } from "../../shared/styles";
import { EditableSectionProps } from "../../shared/types";
import { useEditingChangeNotifier } from "../../shared/useEditingChangeNotifier";
import { useEnumTranslation } from "../shared";
import { AgentContactDetailsDisplay } from "./AgentContactDetailsDisplay";
import { AgentContactDetailsEdit } from "./AgentContactDetailsEdit";
import { AgentContactDetailsFormData, createAgentContactDetailsSchema } from "./agentContactDetailsSchema";

type Props = {
  agent: ApiAgentProfileGet;
} & EditableSectionProps;

export type ContactDetailsRef = {
  handleEditClick: () => void;
};

const roleKeys = Object.values(AgentRoles);

export const AgentContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails(
  { agent, onEditingChange },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateAgent, isPending } = useUpdateAgentContact(String(agent?.representatives?.[0]?.id));
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const { options, keysToLabels, toLabel, toKey } = useEnumTranslation(
    roleKeys,
    "dashboard.agentProfile.contactDetails.roles",
  );

  const schema = createAgentContactDetailsSchema(t);

  const initialFormValues = agent?.representatives?.[0];

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
    updateAgent(values, {
      onSuccess: () => {
        reset(values);
        setIsEditing(false);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <FormContainer $isEditing={isEditing}>
        {isEditing ? (
          <AgentContactDetailsEdit
            options={options}
            toLabel={toLabel}
            toKey={toKey}
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
