"use client";

import { useApiServices } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { useUpdateOrganization } from "@/hooks/useUpdateOrganizationDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOrganizationGet, ApiOrganizationPatch, Lang } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { useEditingChangeNotifier } from "../shared/useEditingChangeNotifier";
import { formatOrganizationAddress, getOrganizationServiceTitles } from "./formatters";
import { OrganizationDetailsDisplay } from "./OrganizationDetailsDisplay";
import { OrganizationDetailsEdit } from "./OrganizationDetailsEdit";
import { createOrganizationDetailsSchema, OrganizationDetailsFormData } from "./organizationDetailsSchema";

type Props = {
  organization: ApiOrganizationGet;
} & EditableSectionProps;

export const OrganizationDetails = forwardRef<EditableSectionRef, Props>(function OrganizationDetails(
  { organization, onEditingChange },
  ref,
) {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateOrganization, isPending } = useUpdateOrganization(String(organization.id));

  useEditingChangeNotifier(isEditing, onEditingChange);

  const { data: apiServices = [] } = useApiServices();
  const serviceMapping = useMemo(() => createMapping(apiServices), [apiServices]);

  const savedStreet = organization.address?.street ?? "";
  const savedPostcode = organization.address?.postcode?.code ?? "";
  const savedWebsite = organization.website ?? "";
  const savedAbout = organization.about ?? "";

  const schema = createOrganizationDetailsSchema(t, savedPostcode, savedWebsite, savedAbout);

  const initialFormValues = useMemo(
    (): OrganizationDetailsFormData => ({
      title: organization.title || "",
      about: savedAbout,
      website: savedWebsite,
      addressStreet: savedStreet,
      addressPostcode: savedPostcode,
    }),
    [organization.title, savedAbout, savedWebsite, savedStreet, savedPostcode],
  );

  const methods = useForm<OrganizationDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = methods;

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

  const onSubmit = (values: OrganizationDetailsFormData) => {
    const patch: ApiOrganizationPatch = {};
    if (dirtyFields.title) patch.title = values.title.trim();
    if (dirtyFields.about) patch.about = values.about.trim() || null;
    if (dirtyFields.website) patch.website = values.website.trim() || null;
    if (dirtyFields.addressStreet || dirtyFields.addressPostcode) {
      patch.addressStreet = values.addressStreet.trim() || null;
      patch.addressPostcode = values.addressPostcode.trim() || null;
    }

    updateOrganization(patch, {
      onSuccess: () => {
        reset(values);
        setIsEditing(false);
      },
    });
  };

  const formattedAddress = formatOrganizationAddress(organization.address);
  const serviceTitles = useMemo(
    () => getOrganizationServiceTitles(organization.services, i18n.language as Lang, serviceMapping.idToTitle),
    [organization.services, i18n.language, serviceMapping.idToTitle],
  );

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="organisation-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <OrganizationDetailsEdit onCancel={handleCancel} onSubmit={handleSubmit(onSubmit)} isPending={isPending} />
        ) : (
          <OrganizationDetailsDisplay address={formattedAddress} services={serviceTitles} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
