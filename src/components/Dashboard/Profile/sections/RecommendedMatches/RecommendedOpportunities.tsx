import { Button } from "@/components/core/button";
import { Heading4, Paragraph } from "@/components/styled/text";
import { recommendedOpportunitiesKey, useRecommendedOpportunities } from "@/hooks/useRecommendedMatches";
import { useSuggestVolunteerOpportunity } from "@/hooks/useSuggestVolunteerOpportunity";
import { useQueryClient } from "@tanstack/react-query";
import { ApiRecommendedOpportunity, Id, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CommuteBadge } from "../../common/CommuteBadge";
import { Accordion } from "../shared/Accordion";
import { SuggestDialog } from "../VolunteerOpportunities/SuggestDialog";
import { RecommendedContainer } from "./styles";

type Props = {
  volunteerId: Id;
  volunteerName: string;
};

export function RecommendedOpportunities({ volunteerId, volunteerName }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<ApiRecommendedOpportunity>();
  const { data: opportunities = [] } = useRecommendedOpportunities(volunteerId, true);

  const { mutate: suggest, isPending } = useSuggestVolunteerOpportunity(() => {
    setSelected(undefined);
    queryClient.invalidateQueries({ queryKey: recommendedOpportunitiesKey(volunteerId) });
  }, ["volunteer-opportunities", String(volunteerId)]);

  if (!opportunities.length) return null;

  return (
    <RecommendedContainer aria-label={t("dashboard.recommended.opportunitiesTitle")}>
      <Heading4 margin={0} color="var(--color-grey-500)">
        {t("dashboard.recommended.opportunitiesTitle")}
      </Heading4>
      {opportunities.map((opportunity) => (
        <Accordion
          key={opportunity.id}
          data-testid="recommended-opportunity"
          headerLeft={
            <>
              <Heading4 margin={0} color="var(--color-midnight)">
                {opportunity.title}
              </Heading4>
              {opportunity.agentTitle && <Paragraph margin={0}>{opportunity.agentTitle}</Paragraph>}
              <CommuteBadge min={opportunity.commute?.min ?? null} max={opportunity.commute?.max ?? null} />
            </>
          }
          onGoToProfile={() =>
            router.push(`/${i18n.language}/dashboard/opportunities/${opportunity.id}?volunteer=${volunteerId}`)
          }
          headerAction={
            <Button
              text={t("dashboard.volunteerProfile.suggestButtonName")}
              onClick={() => setSelected(opportunity)}
              height="40px"
              padding="0 var(--spacing-16)"
            />
          }
        />
      ))}
      {selected && (
        <SuggestDialog
          volunteerName={volunteerName}
          opportunityName={selected.title}
          onCancel={() => setSelected(undefined)}
          onConfirm={(emailNote) =>
            suggest({
              opportunityId: Number(selected.id),
              volunteerId: Number(volunteerId),
              status: OpportunityVolunteerStatusType.PENDING,
              emailNote,
            })
          }
          isPending={isPending}
        />
      )}
    </RecommendedContainer>
  );
}
