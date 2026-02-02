"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useUpdateOpportunityRac } from "@/hooks/useUpdateOpportunityRac";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  EditableButtonRow as ButtonRow,
  EditableContainer as Container,
  EditableDetails as Details,
} from "../shared/styles";
import {
  createRefugeeAccommodationCentreSchema,
  RefugeeAccommodationCentreFormData,
} from "./refugeeAccommodationCentreSchema";
import { RacData, RefugeeAccommodationCentreRef } from "./types";

type Props = {
  opportunity: ApiOpportunityGet;
};

export const RefugeeAccommodationCentre = forwardRef<RefugeeAccommodationCentreRef, Props>(
  function RefugeeAccommodationCentre({ opportunity }, ref) {
    const { t } = useTranslation();
    const { mutate: updateRac, isPending } = useUpdateOpportunityRac(opportunity.id);
    const [isEditing, setIsEditing] = useState(false);

    const schema = createRefugeeAccommodationCentreSchema(t);

    const initialFormValues = useMemo((): RefugeeAccommodationCentreFormData => {
      // TODO: SDK ApiOpportunityGet type doesn't include nested rac object
      const rac = (opportunity as ApiOpportunityGet & { rac?: RacData }).rac;

      return {
        name: rac?.name ?? "",
        address: rac?.address ?? "",
        district: rac?.district ?? "",
      };
    }, [opportunity]);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isValid, isDirty },
    } = useForm<RefugeeAccommodationCentreFormData>({
      resolver: zodResolver(schema),
      mode: "onChange",
      defaultValues: initialFormValues,
    });

    const handleEditClick = () => setIsEditing(true);

    useImperativeHandle(ref, () => ({ handleEditClick }));

    const handleCancel = () => {
      reset();
      setIsEditing(false);
    };

    const onSubmit = (values: RefugeeAccommodationCentreFormData) => {
      updateRac({ rac: values }, { onSuccess: () => setIsEditing(false) });
    };

    useEffect(() => {
      if (isEditing) return;
      reset(initialFormValues);
    }, [initialFormValues, isEditing, reset]);

    const mode = isEditing ? "edit" : "display";

    return (
      <Container data-testid="refugee-accommodation-centre-container" $isEditing={isEditing}>
        <Details>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <EditableField
                mode={mode}
                type="text"
                label={t("dashboard.opportunityProfile.rac.name")}
                value={field.value}
                setValue={field.onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <EditableField
                mode={mode}
                type="text"
                label={t("dashboard.opportunityProfile.rac.address")}
                value={field.value}
                setValue={field.onChange}
                errorMessage={errors.address?.message}
              />
            )}
          />

          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <EditableField
                mode={mode}
                type="text"
                label={t("dashboard.opportunityProfile.rac.district")}
                value={field.value}
                setValue={field.onChange}
                errorMessage={errors.district?.message}
              />
            )}
          />
        </Details>

        {isEditing && (
          <ButtonRow>
            <Button
              text={t("dashboard.opportunityProfile.rac.cancel")}
              onClick={handleCancel}
              width="auto"
              padding="var(--volunteer-profile-section-card-header-button-padding)"
              backgroundcolor="var(--color-white)"
              textColor="var(--color-aubergine)"
              border="var(--volunteer-profile-section-card-header-button-border)"
            />
            <Button
              text={t("dashboard.opportunityProfile.rac.saveChanges")}
              onClick={handleSubmit(onSubmit)}
              width="auto"
              padding="var(--volunteer-profile-section-card-header-button-padding)"
              disabled={!isDirty || !isValid || isPending}
            />
          </ButtonRow>
        )}
      </Container>
    );
  },
);
