"use client";
import { useUpdateOpportunityAgent } from "@/hooks/useUpdateOpportunityAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet, Lang } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { useEditingChangeNotifier } from "../shared/useEditingChangeNotifier";
import { RefugeeAccommodationCentreDisplay } from "./RefugeeAccommodationCentreDisplay";
import { RefugeeAccommodationCentreEdit } from "./RefugeeAccommodationCentreEdit";
import {
  createRefugeeAccommodationCentreSchema,
  RefugeeAccommodationCentreFormData,
} from "./refugeeAccommodationCentreSchema";

type Props = {
  opportunity: ApiOpportunityGet;
} & EditableSectionProps;

export const RefugeeAccommodationCentre = forwardRef<EditableSectionRef, Props>(function RefugeeAccommodationCentre(
  { opportunity, onEditingChange },
  ref,
) {
  const { t, i18n } = useTranslation();
  const { mutate: updateAgent, isPending } = useUpdateOpportunityAgent(opportunity.id);
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const schema = createRefugeeAccommodationCentreSchema(t);

  const initialFormValues = useMemo((): RefugeeAccommodationCentreFormData => {
    const { agent } = opportunity;
    const lang = i18n.language as Lang;
    const districtTitle = agent.district?.title?.[lang] ?? agent.district?.title?.en ?? "";

    return {
      name: agent.name ?? "",
      address: agent.address ?? "",
      district: districtTitle,
    };
  }, [opportunity, i18n.language]);

  const methods = useForm<RefugeeAccommodationCentreFormData>({
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

  const onSubmit = (values: RefugeeAccommodationCentreFormData) => {
    updateAgent(
      {
        agent: {
          name: values.name,
          address: values.address,
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  useEffect(() => {
    if (isEditing) return;
    reset(initialFormValues);
  }, [initialFormValues, isEditing, reset]);

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="refugee-accommodation-centre-container" $isEditing={isEditing}>
        {isEditing ? (
          <RefugeeAccommodationCentreEdit
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <RefugeeAccommodationCentreDisplay />
        )}
      </FormContainer>
    </FormProvider>
  );
});
