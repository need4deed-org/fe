import { opportunityFieldStackingThreshold } from "@/config/constants";
import { EditableField } from "@/components/EditableField/EditableField";
import {
  Card,
  IconContainer,
  ProfileContent,
  ProfileInfo,
  StatusSection,
  TitleSection,
} from "@/components/Dashboard/Profile/sections/ProfileHeader/common/profileHeaderStyles";
import { ShootingStarIcon } from "@phosphor-icons/react";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ApiAgentMembershipSummary, VolunteerStateTypeType } from "need4deed-sdk";
import { SOURCE_TEXT_LIMITS } from "@/utils/opportunity-text-limits";
import { VolunteerTypeRow, TypeButtons, TypeButton, NGOTypeRow, NGOnonEditableRow, NGOPickerColumn } from "./styled";
import { Heading3, Heading4 } from "@/components/styled/text";
import { createVolunteerTypeLabelMap } from "@/components/Dashboard/Profile/sections/ProfileHeader/common/labelMaps";
import { HeaderFormData } from "./headerSchema";
import { ErrorMessage } from "@/components/core/common";
import { AgentPicker } from "@/components/Dashboard/Home/NgoVolunteers/AgentPicker";
import { AgentOption } from "@/hooks/useAgentSearch";
import { useState } from "react";

const SELECTABLE_VOLUNTEER_TYPES = [
  VolunteerStateTypeType.REGULAR,
  VolunteerStateTypeType.ACCOMPANYING,
  VolunteerStateTypeType.EVENTS,
] as const;

type Props = {
  selectedType: VolunteerStateTypeType | undefined;
  agentTitles: ApiAgentMembershipSummary[];
  canPickAnyNgo?: boolean;
  selectedAgentTitle?: string;
};

export default function OpportunityHeaderCard({ selectedType, agentTitles, canPickAnyNgo, selectedAgentTitle }: Props) {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<HeaderFormData>();
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);
  const [pickedAgent, setPickedAgent] = useState<AgentOption>();
  return (
    <Card>
      <ProfileContent>
        <IconContainer>
          <ShootingStarIcon size={120} color="var(--color-blue-500)" weight="duotone" />
        </IconContainer>
        <ProfileInfo>
          <TitleSection>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <EditableField
                  stackAt={opportunityFieldStackingThreshold}
                  mode="edit"
                  type="text"
                  label={t("dashboard.newOpportunity.fields.title")}
                  value={field.value}
                  setValue={field.onChange}
                  hint={t("dashboard.opportunityProfile.opportunityDetails.maxCharsHint", {
                    max: SOURCE_TEXT_LIMITS.title.max,
                  })}
                  errorMessage={errors.title?.message}
                />
              )}
            />
          </TitleSection>

          <StatusSection>
            <VolunteerTypeRow>
              <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}</Heading4>
              <TypeButtons>
                {SELECTABLE_VOLUNTEER_TYPES.map((type) => (
                  <TypeButton
                    key={type}
                    type="button"
                    $active={selectedType === type}
                    onClick={() => setValue("volunteerType", type, { shouldValidate: true })}
                  >
                    {volunteerTypeLabelMap[type]}
                  </TypeButton>
                ))}
              </TypeButtons>
            </VolunteerTypeRow>
            {errors.volunteerType?.message && (
              <ErrorMessage message={errors.volunteerType?.message} justifyContent="end" />
            )}
          </StatusSection>

          <NGOTypeRow>
            <Controller
              name="agentId"
              control={control}
              render={({ field }) =>
                canPickAnyNgo ? (
                  <NGOPickerColumn>
                    <Heading4>{t("dashboard.newOpportunity.fields.ngo")}</Heading4>
                    <AgentPicker
                      hideInactive
                      selected={
                        field.value
                          ? {
                              id: field.value,
                              title: (pickedAgent?.id === field.value ? pickedAgent.title : selectedAgentTitle) ?? "",
                            }
                          : undefined
                      }
                      onSelect={(agent) => {
                        setPickedAgent(agent);
                        setValue("agentId", agent?.id ?? 0, { shouldValidate: Boolean(agent) });
                      }}
                    />
                    {errors.agentId?.message && <ErrorMessage message={errors.agentId.message} />}
                  </NGOPickerColumn>
                ) : agentTitles.length > 1 ? (
                  <EditableField
                    stackAt={opportunityFieldStackingThreshold}
                    mode="edit"
                    type="radio-list"
                    label={t("dashboard.newOpportunity.fields.ngo")}
                    value={field.value}
                    setValue={field.onChange}
                    labels={agentTitles?.map((agent) => agent.agentTitle)}
                    displayValue={agentTitles?.find((agent) => agent.agentId === field.value)?.agentTitle}
                    options={agentTitles?.map((agent) => agent.agentId)}
                    errorMessage={errors.agentId?.message}
                  />
                ) : (
                  <NGOnonEditableRow>
                    <Heading4>{t("dashboard.newOpportunity.fields.ngo")}</Heading4>
                    <Heading3>{agentTitles[0]?.agentTitle ?? "-"}</Heading3>
                  </NGOnonEditableRow>
                )
              }
            />
          </NGOTypeRow>
        </ProfileInfo>
      </ProfileContent>
    </Card>
  );
}
