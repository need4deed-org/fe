"use client";
import { SectionCard } from "@/components/Dashboard/Profile/common/SectionCard";
import {
  ApiLanguageOption,
  useApiActivities,
  useApiLanguages,
  useApiSkills,
} from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import {
  createNewOpportunityDetailsSchema,
  getMainCommunicationLanguageOptions,
  NewOpportunityDetailsFormData,
} from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { AccompanyingDetailsEdit } from "@/components/Dashboard/Profile/sections/AccompanyingDetails/AccompanyingDetailsEdit";
import { BackButton, PageContainer } from "@/components/Dashboard/Profile/styles";
import { IconName } from "@/components/Dashboard/Profile/types";
import Button from "@/components/core/button/Button/Button";
import { apiPathAgent, apiPathOpportunity, DashboardRoutes } from "@/config/constants";
import { useGetQuery, useMutationQuery } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { de, enUS } from "date-fns/locale";
import {
  ApiAgentGet,
  TranslatedIntoType,
  VolunteerStateTypeType,
  OpportunityFormDataWithAgentSubmitter,
  ApiOpportunityGet,
  Lang,
} from "need4deed-sdk";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createAccompanyingDetailsSchema,
  AccompanyingDetailsFormData,
} from "../Profile/sections/AccompanyingDetails/createAccompanyingDetailsSchema";
import { AddressWarning, SaveRow } from "./styled";
import { OpportunityDetailsFields } from "./fields/OpportunityDetailsFields";
import { buildCreatePayload } from "./helper";
import { createHeaderSchema, HeaderFormData } from "./headerSchema";
import OpportunityHeaderCard from "./OpportunityHeaderCard";
import DescriptionField from "./fields/DescriptionField";
import {
  OpportunityAddressFields,
  OpportunityAddressFormData,
  createOpportunityAddressSchema,
  toAddressFormData,
  toApiAddress,
} from "../Profile/sections/OpportunityAddress";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMinAppointmentDate } from "@/hooks/useMinAppointmentDate";
import { apiToFormAvailability } from "../Profile/sections/VolunteerProfile/availabilityUtils";
import { isoCodeToLanguage, languageToIsoCode } from "./helper";

export function NewOpportunity() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;
  const router = useRouter();

  const requestedAgentId = Number(useSearchParams().get("agentId")) || 0;
  const duplicateOpportunityId = Number(useSearchParams().get("duplicateOpportunityId")) || 0;

  const userData = useCurrentUser();
  const currentAgents = userData?.agentMemberships ?? [];
  const duplicateOpportunity = useGetQuery<ApiOpportunityGet>({
    apiPath: `${apiPathOpportunity}/${duplicateOpportunityId}`,
    queryKey: ["opportunity", String(duplicateOpportunityId)],
    enabled: Boolean(duplicateOpportunityId),
  }).data;

  const minAppointmentDate = useMinAppointmentDate();

  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();

  const toFormOption = (l: ApiLanguageOption) => ({
    id: l.id,
    title: { [lang as Lang]: l.title } as Record<Lang, string>,
  });
  const mainCommunicationLanguagesForForm = getMainCommunicationLanguageOptions(apiLanguages).map(toFormOption);

  const mainLanguageIsoToIdMap = new Map(
    mainCommunicationLanguagesForForm.map((l) => [languageToIsoCode(l.title[lang as Lang]), l.id]),
  );
  const IdToLanguageMap = new Map(apiLanguages.map((l) => [l.id, l.title]));

  const headerMethods = useForm<HeaderFormData>({
    resolver: zodResolver(createHeaderSchema(t)),
    mode: "onChange",
    defaultValues: {
      title: duplicateOpportunity?.title ?? "",
      volunteerType: duplicateOpportunity?.volunteerType ?? undefined,
      agentId: duplicateOpportunity?.agent?.id ?? 0,
    },
  });
  const { watch: watchHeader, setValue: setAgentId } = headerMethods;
  const selectedType = watchHeader("volunteerType");
  const selectedAgentId = watchHeader("agentId");

  const isAccompanying = selectedType === VolunteerStateTypeType.ACCOMPANYING;
  const isEvent = selectedType === VolunteerStateTypeType.EVENTS;
  const requestedIsOwn = currentAgents.some((agent) => agent.agentId === requestedAgentId);
  const firstNGOId = requestedIsOwn ? requestedAgentId : currentAgents[0]?.agentId || (userData?.agentId ?? 0);

  const detailsMethods = useForm<NewOpportunityDetailsFormData>({
    resolver: zodResolver(createNewOpportunityDetailsSchema(t, getMainCommunicationLanguageOptions(apiLanguages))),
    mode: "onChange",
    defaultValues: {
      description: duplicateOpportunity?.description ?? "",
      numberOfVolunteers: String(duplicateOpportunity?.numberOfVolunteers) ?? "1",
      mainCommunication: [
        {
          id: mainLanguageIsoToIdMap.get(duplicateOpportunity?.originalLanguage) ?? 1,
          language: isoCodeToLanguage(duplicateOpportunity?.originalLanguage, lang) ?? "",
          level: "",
        },
      ],
      residentsSpeak: duplicateOpportunity?.languages.map((lan) => ({
        id: lan.id,
        language: lan.title,
        level: "",
      })) ?? [{ id: 1, language: "", level: "" }],
      availability: apiToFormAvailability(duplicateOpportunity?.availability) ?? [],
      eventDate: duplicateOpportunity?.event?.date ? new Date(`${duplicateOpportunity?.event?.date}`) : null,
      eventTime: duplicateOpportunity?.event?.time ?? "",
      activities: duplicateOpportunity?.activities.map((act) => String(act.id)) ?? [],
      skills: duplicateOpportunity?.skills.map((skill) => String(skill.id)) ?? [],
    },
  });

  const { accompanyingDetails: accompanyingDetailsDefaultValues } = duplicateOpportunity || {};

  const accompanyingMethods = useForm<AccompanyingDetailsFormData>({
    resolver: zodResolver(createAccompanyingDetailsSchema(t, true, minAppointmentDate)),
    mode: "onChange",
    defaultValues: {
      appointmentAddress: accompanyingDetailsDefaultValues?.appointmentAddress ?? "",
      appointmentPostcode: accompanyingDetailsDefaultValues?.appointmentPostcode ?? "",
      appointmentDate: accompanyingDetailsDefaultValues?.appointmentDate
        ? new Date(`${accompanyingDetailsDefaultValues?.appointmentDate}`)
        : null,
      appointmentTime: accompanyingDetailsDefaultValues?.appointmentTime ?? "",
      refugeeNumber: accompanyingDetailsDefaultValues?.refugeeNumber ?? "",
      refugeeName: accompanyingDetailsDefaultValues?.refugeeName ?? "",
      refugeeLanguage:
        accompanyingDetailsDefaultValues?.refugeeLanguage?.map((refLang) => IdToLanguageMap.get(Number(refLang.id))) ??
        [],
      appointmentLanguage: accompanyingDetailsDefaultValues?.appointmentLanguage ?? undefined,
    },
  });

  const addressMethods = useForm<OpportunityAddressFormData>({
    resolver: zodResolver(createOpportunityAddressSchema(t)),
    mode: "onChange",
    defaultValues: toAddressFormData(),
  });

  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  apiLanguages.forEach((l) => {
    keyToLabel[String(l.id)] = l.title;
    labelToKey[l.title] = String(l.id);
  });
  const appointmentLanguageKeys = Object.values(TranslatedIntoType);
  const appointmentLanguageKeyToLabel: Record<string, string> = {};
  const appointmentLanguageLabelToKey: Record<string, string> = {};
  appointmentLanguageKeys.forEach((key) => {
    const label = t(`dashboard.opportunityProfile.accompanyingDetails.appointmentLanguageOptions.${key}`);
    appointmentLanguageKeyToLabel[key] = label;
    appointmentLanguageLabelToKey[label] = key;
  });

  const { data: selectedAgent } = useGetQuery<ApiAgentGet>({
    apiPath: `${apiPathAgent}/${selectedAgentId}`,
    queryKey: ["agent", String(selectedAgentId)],
    enabled: Boolean(selectedAgentId),
  });
  const isAgentAddressMissing = Boolean(selectedAgent) && !selectedAgent?.agentDetails?.addressPostcode;

  const { mutate: createOpportunity, isPending } = useMutationQuery<OpportunityFormDataWithAgentSubmitter, unknown>({
    apiPath: `${apiPathOpportunity}/`,
    method: "post",
    onSuccessCallback: () => {
      router.push(`/${lang}${DashboardRoutes.Home}`);
    },
    queryKeyToInvalidate: [
      ["agent-opportunities", String(selectedAgentId)],
      ["agent", String(selectedAgentId)],
    ],
  });

  const handleCreate = async () => {
    const headerValid = await headerMethods.trigger();
    const detailsValid = await detailsMethods.trigger();
    const accompValid = !isAccompanying || (await accompanyingMethods.trigger());
    const addressValid = isAccompanying || (await addressMethods.trigger());
    if (!headerValid || !detailsValid || !accompValid || !addressValid || !selectedAgentId || isAgentAddressMissing)
      return;

    const payload = buildCreatePayload(
      headerMethods.getValues(),
      detailsMethods.getValues(),
      isAccompanying ? accompanyingMethods.getValues() : null,
      apiLanguages,
      apiActivities,
      apiSkills,
      lang,
      t,
      selectedAgentId,
      isAccompanying ? null : toApiAddress(addressMethods.getValues()),
    );
    createOpportunity(payload);
  };

  useEffect(() => {
    if (firstNGOId) {
      setAgentId("agentId", firstNGOId);
    }
  }, [firstNGOId]);

  return (
    <PageContainer>
      <BackButton onClick={() => router.back()}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackButton>
      <Heading2>{t("dashboard.newOpportunity.title")}</Heading2>
      <FormProvider {...headerMethods}>
        <OpportunityHeaderCard selectedType={selectedType} agentTitles={currentAgents} />
      </FormProvider>
      {isAccompanying ? (
        <SectionCard
          iconName={IconName.Users}
          title={t("dashboard.opportunityProfile.accompanyingDetailsTitle")}
          subComponent={
            <>
              <FormProvider {...accompanyingMethods}>
                <AccompanyingDetailsEdit
                  locale={locale}
                  languageOptions={apiLanguages.map((l) => l.title)}
                  keyToLabel={keyToLabel}
                  labelToKey={labelToKey}
                  appointmentLanguageOptions={appointmentLanguageKeys.map((k) => appointmentLanguageKeyToLabel[k])}
                  appointmentLanguageKeyToLabel={appointmentLanguageKeyToLabel}
                  appointmentLanguageLabelToKey={appointmentLanguageLabelToKey}
                  onCancel={() => {}}
                  onSubmit={() => {}}
                  isPending={false}
                  minAppointmentDate={minAppointmentDate}
                  hideButtons
                />
              </FormProvider>
              <FormProvider {...detailsMethods}>
                <DescriptionField prefix={"dashboard.opportunityProfile.opportunityDetails"} />
              </FormProvider>
            </>
          }
        />
      ) : (
        <SectionCard
          iconName={IconName.Wrench}
          title={t("dashboard.opportunityProfile.opportunityDetails.title")}
          subComponent={
            <>
              <FormProvider {...detailsMethods}>
                <OpportunityDetailsFields
                  isEvent={isEvent}
                  apiLanguages={apiLanguages}
                  apiActivities={apiActivities}
                  apiSkills={apiSkills}
                />
              </FormProvider>
              <FormProvider {...addressMethods}>
                <OpportunityAddressFields />
              </FormProvider>
            </>
          }
        />
      )}
      {isAgentAddressMissing && (
        <AddressWarning role="alert">
          {t("dashboard.newOpportunity.addressMissing")}{" "}
          <Link href={`/${lang}${DashboardRoutes.Agents}/${selectedAgentId}`} target="_blank" rel="noopener noreferrer">
            {t("dashboard.newOpportunity.addressMissingLink")}
          </Link>
        </AddressWarning>
      )}
      <SaveRow>
        <Button
          text={t("dashboard.newOpportunity.submit")}
          backgroundcolor="var(--color-aubergine)"
          textColor="var(--color-white)"
          onClick={handleCreate}
          disabled={isPending || !selectedAgentId || isAgentAddressMissing}
        />
      </SaveRow>
    </PageContainer>
  );
}
