import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { Paragraph } from "@/components/styled/text";
import { apiPathAgent, apiPathOpportunity, apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOpportunityGet, ApiVolunteerGet } from "need4deed-sdk";
import { ReactNode } from "react";
import styled from "styled-components";
import { ProfileEntityType } from "./ProfileLayout";
import ProfilePage from "./ProfilePage";
import { ApiAgentProfileGet } from "./types/agent";

const LoadingContainer = styled(CenteredWrapper)`
  padding: 2rem;
`;

const ErrorContainer = styled(CenteredWrapper)`
  padding: 2rem;
  color: var(--color-red-600);
`;

type LoadingErrorWrapperProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data: unknown;
  entityType: ProfileEntityType;
  children: ReactNode;
};

const LoadingErrorWrapper = ({ isLoading, isError, error, data, entityType, children }: LoadingErrorWrapperProps) => {
  if (isLoading) {
    return (
      <LoadingContainer>
        <Paragraph>Loading {entityType} profile...</Paragraph>
      </LoadingContainer>
    );
  }

  if (isError) {
    let errorMessage = `Failed to load ${entityType} profile. Please try again.`;

    if (error) {
      if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === "object" && error !== null) {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("response" in error && typeof error.response === "object" && error.response !== null) {
          const response = error.response as { data?: { message?: string } };
          if (response.data?.message) {
            errorMessage = response.data.message;
          }
        }
      }
    }

    return (
      <ErrorContainer>
        <Paragraph>{errorMessage}</Paragraph>
      </ErrorContainer>
    );
  }

  if (!data) {
    return (
      <ErrorContainer>
        <Paragraph>No {entityType} data available.</Paragraph>
      </ErrorContainer>
    );
  }

  return <>{children}</>;
};

type EntityIdProps = {
  entityId: string;
};

const VolunteerProfileController = ({ entityId }: EntityIdProps) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer", entityId],
    apiPath: `${apiPathVolunteer}${entityId}`,
    staleTime: cacheTTL,
  });

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      entityType="volunteer"
    >
      {data && <ProfilePage volunteer={data} />}
    </LoadingErrorWrapper>
  );
};

const OpportunityProfileController = ({ entityId }: EntityIdProps) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiOpportunityGet>({
    queryKey: ["opportunity", entityId],
    apiPath: `${apiPathOpportunity}/${entityId}`,
    staleTime: cacheTTL,
  });

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      entityType="opportunity"
    >
      {data && <ProfilePage opportunity={data} />}
    </LoadingErrorWrapper>
  );
};

const AgentProfileController = ({ entityId }: EntityIdProps) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiAgentProfileGet>({
    queryKey: ["agent", entityId],
    apiPath: `${apiPathAgent}/${entityId}`,
    staleTime: cacheTTL,
  });

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      entityType="agent"
    >
      {data && <ProfilePage agent={data} />}
    </LoadingErrorWrapper>
  );
};

type Props = {
  entityId: string;
  entityType: ProfileEntityType;
};

export const ProfileController = ({ entityId, entityType }: Props) => {
  if (entityType === "volunteer") {
    return <VolunteerProfileController entityId={entityId} />;
  }

  if (entityType === "agent") {
    return <AgentProfileController entityId={entityId} />;
  }

  return <OpportunityProfileController entityId={entityId} />;
};
