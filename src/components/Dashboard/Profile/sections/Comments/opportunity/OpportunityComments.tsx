"use client";
import { ApiOpportunityGet } from "need4deed-sdk";
import { EntityComments } from "../common";

type Props = {
  opportunity: ApiOpportunityGet;
};

export function OpportunityComments({ opportunity }: Props) {
  return (
    <EntityComments
      entityId={opportunity.id}
      entityType="opportunity"
      comments={opportunity.comments}
      testId="opportunity-comments-container"
    />
  );
}
