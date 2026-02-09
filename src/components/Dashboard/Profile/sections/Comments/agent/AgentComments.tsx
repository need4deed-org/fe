"use client";
import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types/agent";
import { EntityComments } from "../common";

type Props = {
  agent: ApiAgentProfileGet;
};

export function AgentComments({ agent }: Props) {
  return (
    <EntityComments
      entityId={agent.id}
      entityType="agent"
      comments={agent.comments ?? []}
      testId="agent-comments-container"
    />
  );
}
