"use client";
import { ROUTES } from "@/constants/routes";
import { SectionCard } from "@/components/Dashboard/Profile/common/SectionCard";
import {
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
import { apiPathAgent, apiPathOpportunity } from "@/config/constants";
import { useGetQuery, useMutationQuery } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { de, enUS } from "date-fns/locale";
import {
  AgentEngagementStatusType,
  ApiAgentGet,
  TranslatedIntoType,
  VolunteerStateTypeType,
  OpportunityFormDataWithAgentSubmitter,
  ApiOpportunityGet,
  LangPurpose,
} from "need4deed-sdk";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createAccompanyingDetailsSchema,
  AccompanyingDetailsFormData,
} from "../Profile/sections/AccompanyingDetails/createAccompanyingDetailsSchema";
import { useAppointmentPLZ } from "../Profile/sections/AccompanyingDetails/use-appointment-plz";
import { AddressWarning, SaveRow } from "./styled";
import { OpportunityDetailsFields } from "./fields/OpportunityDetailsFields";
import { ALLOWED_VOLUNTEER_TYPES, buildCreatePayload, populateDuplicateOpportunity } from "./helper";
import { createHeaderSchema, HeaderFormData } from "./headerSchema";
import OpportunityHeaderCard from "./OpportunityHeaderCard";
import DescriptionField from "./fields/DescriptionField";
import {
  OpportunityAddressFields,
  OpportunityAddressFormData,
  createOpportunityAddressSchema,
  toAddressFormData,
  toApiAddress,
  useAddressPLZ,
} from "../Profile/sections/OpportunityAddress";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMinAppointmentDate } from "@/hooks/useMinAppointmentDate";
import { apiToFormAvailability } from "../Profile/sections/VolunteerProfile/availabilityUtils";
import { languagesToFormValues } from "../Profile/sections/OpportunityDetails/formatters";
import { getInitialFormValues } from "../Profile/sections/AccompanyingDetails/helpers";
import { dateFromDateTimeUTCStrings, formatToLocalTime } from "@/utils";

export function NewOpportunity() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;
  const router = useRouter();
  const hasInitializedDuplicate = useRef(false);

  const requestedAgentId = Number(useSearchParams().get("agentId")) || 0;
  const duplicateOpportunityId = Number(useSearchParams().get("duplicateOpportunityId")) || 0;

  const userData = useCurrentUser();
  const currentAgents = userData?.agentMemberships ?? [];
  const duplicateOpportunity = useGetQuery<ApiOpportunityGet>({
    apiPath: `${apiPathOpportunity}/${duplicateOpportunityId}`,
    queryKey: ["opportunity", String(duplicateOpportunityId)],
    enabled: Boolean(duplicateOpportunityId),
  }).data;
  const { isAuthorized: isStaff } = useAuth();

  const minAppointmentDate = useMinAppointmentDate();

  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();

  const generalLangs = duplicateOpportunity?.languages.filter((l) => l.purpose === LangPurpose.GENERAL);
  const seenResidents = new Set<number>();
  const residentsLangs = duplicateOpportunity?.languages.filter((l) => {
    if (l.purpose !== LangPurpose.RECIPIENT && l.purpose !== LangPurpose.TRANSLATION) return false;
    if (seenResidents.has(l.id)) return false;
    seenResidents.add(l.id);
    return true;
  });

  const headerMethods = useForm<HeaderFormData>({
    resolver: zodResolver(createHeaderSchema(t)),
    mode: "onChange",
    defaultValues: {
      title: duplicateOpportunity?.title ?? "",
      volunteerType: (duplicateOpportunity?.volunteerType as ALLOWED_VOLUNTEER_TYPES) ?? undefined,
      agentId: duplicateOpportunity?.agent?.id ?? 0,
    },
  });
  const { watch: watchHeader, setValue: setAgentId } = headerMethods;
  const selectedType = watchHeader("volunteerType");
  const selectedAgentId = watchHeader("agentId");

  const isAccompanying = selectedType === VolunteerStateTypeType.ACCOMPANYING;
  const isEvent = selectedType === VolunteerStateTypeType.EVENTS;
  const requestedIsOwn = currentAgents.some((agent) => agent.agentId === requestedAgentId);
  const firstNGOId =
    isStaff || requestedIsOwn ? requestedAgentId : currentAgents[0]?.agentId || (userData?.agentId ?? 0);

  let currentEventDateTime: Date | null = null;
  if (duplicateOpportunity?.event?.date && duplicateOpportunity.event?.time) {
    currentEventDateTime = dateFromDateTimeUTCStrings(duplicateOpportunity.event.date, duplicateOpportunity.event.time);
  }

  const detailsMethods = useForm<NewOpportunityDetailsFormData>({
    resolver: zodResolver(createNewOpportunityDetailsSchema(t, getMainCommunicationLanguageOptions(apiLanguages))),
    mode: "onChange",
    defaultValues: {
      description: String(duplicateOpportunity?.description ?? ""),
      numberOfVolunteers: String(duplicateOpportunity?.numberOfVolunteers ?? 1),
      mainCommunication: languagesToFormValues(generalLangs ?? [], t) ?? [{ id: 1, language: "", level: "" }],
      residentsSpeak: languagesToFormValues(residentsLangs ?? [], t) ?? [{ id: 1, language: "", level: "" }],
      availability: apiToFormAvailability(duplicateOpportunity?.availability) ?? [],
      eventDate: currentEventDateTime ? currentEventDateTime : null,
      eventTime: currentEventDateTime ? formatToLocalTime(currentEventDateTime) : "",
      activities: duplicateOpportunity?.activities.map((act) => String(act.id)) ?? [],
      skills: duplicateOpportunity?.skills.map((skill) => String(skill.id)) ?? [],
    },
  });

  const { accompanyingDetails: accompanyingDetailsDefaultValues } = duplicateOpportunity || {};
  const accompanyingInitValues = getInitialFormValues(accompanyingDetailsDefaultValues);

  const accompanyingMethods = useForm<AccompanyingDetailsFormData>({
    resolver: zodResolver(createAccompanyingDetailsSchema(t, true, minAppointmentDate)),
    mode: "onChange",
    defaultValues: {
      appointmentAddress: accompanyingInitValues?.appointmentAddress ?? "",
      appointmentPostcode: accompanyingInitValues?.appointmentPostcode ?? "",
      appointmentDate: null,
      appointmentTime: "",
      refugeeNumber: "",
      refugeeName: "",
      refugeeLanguage: accompanyingInitValues?.refugeeLanguage ?? [],
      appointmentLanguage: accompanyingInitValues?.appointmentLanguage ?? undefined,
    },
  });

  const duplicateOpportunityAddress = duplicateOpportunity?.address?.postcode
    ? {
        notMyLocation: true,
        street: duplicateOpportunity?.address?.street ?? "",
        postcode: duplicateOpportunity?.address?.postcode ?? "",
        city: duplicateOpportunity?.address?.city ?? "",
      }
    : undefined;

  const addressMethods = useForm<OpportunityAddressFormData>({
    resolver: zodResolver(createOpportunityAddressSchema(t)),
    mode: "onChange",
    defaultValues: toAddressFormData(duplicateOpportunityAddress),
  });

  const addressPLZ = useAddressPLZ(addressMethods.control);
  const appointmentPLZ = useAppointmentPLZ(accompanyingMethods.control);
  const isPLZBlocking = isAccompanying ? appointmentPLZ.blocksSubmit : addressPLZ.blocksSubmit;

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

  const { data: selectedAgent, isError: isAgentError } = useGetQuery<ApiAgentGet>({
    apiPath: `${apiPathAgent}/${selectedAgentId}`,
    queryKey: ["agent", String(selectedAgentId)],
    enabled: Boolean(selectedAgentId),
  });
  const isAgentAddressMissing = Boolean(selectedAgent) && !selectedAgent?.agentDetails?.addressPostcode;
  const isAgentInactive = selectedAgent?.statusEngagement === AgentEngagementStatusType.INACTIVE;
  const isAgentNotReady = !selectedAgent || isAgentAddressMissing || isAgentInactive;

  const { mutate: createOpportunity, isPending } = useMutationQuery<OpportunityFormDataWithAgentSubmitter, unknown>({
    apiPath: `${apiPathOpportunity}/`,
    method: "post",
    onSuccessCallback: () => {
      router.push(isStaff ? ROUTES.opportunities(lang) : ROUTES.dashboard(lang));
    },
    queryKeyToInvalidate: [
      ["agent-opportunities", String(selectedAgentId)],
      ["agent", String(selectedAgentId)],
      ["opportunities"],
    ],
  });

  const handleCreate = async () => {
    const headerValid = await headerMethods.trigger();
    const detailsValid = await detailsMethods.trigger();
    const accompValid = !isAccompanying || (await accompanyingMethods.trigger());
    const addressValid = isAccompanying || (await addressMethods.trigger());
    if (!headerValid || !detailsValid || !accompValid || !addressValid || !selectedAgentId || isAgentNotReady) return;

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
    if (firstNGOId && !duplicateOpportunityId) {
      setAgentId("agentId", firstNGOId);
    }
  }, [firstNGOId, duplicateOpportunityId]);

  useEffect(() => {
    if (!duplicateOpportunity || hasInitializedDuplicate.current) return;
    populateDuplicateOpportunity({
      duplicateOpportunity,
      headerMethods,
      detailsMethods,
      addressMethods,
      accompanyingMethods,
      accompanyingInitValues,
      currentEventDateTime,
      generalLangs,
      residentsLangs,
      duplicateOpportunityAddress,
      t,
    });

    hasInitializedDuplicate.current = true;
  }, [duplicateOpportunity]);

  return (
    <PageContainer>
      <BackButton onClick={() => router.back()}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackButton>
      <Heading2>{t("dashboard.newOpportunity.title")}</Heading2>
      <FormProvider {...headerMethods}>
        <OpportunityHeaderCard
          selectedType={selectedType}
          agentTitles={currentAgents}
          canPickAnyNgo={isStaff}
          selectedAgentTitle={selectedAgent?.title}
        />
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
                  plzStatus={appointmentPLZ.status}
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
                <OpportunityAddressFields plzStatus={addressPLZ.status} />
              </FormProvider>
            </>
          }
        />
      )}
      {Boolean(selectedAgentId) && isAgentError && (
        <AddressWarning role="alert">{t("dashboard.newOpportunity.agentUnavailable")}</AddressWarning>
      )}
      {isAgentInactive && <AddressWarning role="alert">{t("dashboard.newOpportunity.agentInactive")}</AddressWarning>}
      {isAgentAddressMissing && (
        <AddressWarning role="alert">
          {t("dashboard.newOpportunity.addressMissing")}{" "}
          <Link href={ROUTES.organizationDetail(lang, selectedAgentId)} target="_blank" rel="noopener noreferrer">
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
          disabled={isPending || !selectedAgentId || isAgentNotReady || isPLZBlocking}
        />
      </SaveRow>
    </PageContainer>
  );
}
