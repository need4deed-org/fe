"use client";
import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { useUpdateOpportunityRac } from "@/hooks/useUpdateOpportunityRac";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  createRefugeeAccommodationCentreSchema,
  RefugeeAccommodationCentreFormData,
} from "./refugeeAccommodationCentreSchema";
import { RefugeeAccommodationCentreRef } from "./types";

const Container = styled.div<{ $isEditing: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isEditing ? "var(--spacing-16)" : "0")};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-24);
  width: 100%;
`;

type Props = {
  opportunity: ApiOpportunityGet;
};

type RacData = {
  name?: string;
  address?: string;
  district?: string;
};

export const RefugeeAccommodationCentre = forwardRef<RefugeeAccommodationCentreRef, Props>(
  function RefugeeAccommodationCentre({ opportunity }, ref) {
    const { t } = useTranslation();
    const { mutate: updateRac, isPending } = useUpdateOpportunityRac(opportunity.id);
    const [isEditing, setIsEditing] = useState(false);

    const schema = createRefugeeAccommodationCentreSchema(t);

    const initialFormValues = useMemo((): RefugeeAccommodationCentreFormData => {
      // @ts-expect-error rac missing on SDK ApiOpportunityGet type
      const rac = opportunity.rac as RacData | undefined;

      return {
        name: rac?.name || "",
        address: rac?.address || "",
        district: rac?.district || "",
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

    const handleEditClick = () => {
      setIsEditing(true);
    };

    useImperativeHandle(ref, () => ({
      handleEditClick,
    }));

    const handleCancel = () => {
      reset();
      setIsEditing(false);
    };

    const onSubmit = (values: RefugeeAccommodationCentreFormData) => {
      updateRac(
        {
          rac: {
            name: values.name,
            address: values.address,
            district: values.district,
          },
        },
        {
          onSuccess: () => {
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
      <Container data-testid="refugee-accommodation-centre-container" $isEditing={isEditing}>
        <Details>
          <Controller
            name="name"
            control={control}
            render={({ field }: { field: ControllerRenderProps<RefugeeAccommodationCentreFormData, "name"> }) => (
              <EditableField
                mode={isEditing ? "edit" : "display"}
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
            render={({ field }: { field: ControllerRenderProps<RefugeeAccommodationCentreFormData, "address"> }) => (
              <EditableField
                mode={isEditing ? "edit" : "display"}
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
            render={({ field }: { field: ControllerRenderProps<RefugeeAccommodationCentreFormData, "district"> }) => (
              <EditableField
                mode={isEditing ? "edit" : "display"}
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
