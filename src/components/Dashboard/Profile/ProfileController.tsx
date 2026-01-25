import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { Paragraph } from "@/components/styled/text";
import { apiPathOpportunity, apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOpportunityGet, ApiVolunteerGet } from "need4deed-sdk";
import styled from "styled-components";
import { ProfileEntityType } from "./ProfileLayout";
import ProfilePage from "./ProfilePage";

const LoadingContainer = styled(CenteredWrapper)`
  padding: 2rem;
`;

const ErrorContainer = styled(CenteredWrapper)`
  padding: 2rem;
  color: var(--color-red-600);
`;

interface ProfileControllerProps {
  entityId: string;
  entityType: ProfileEntityType;
}

export function ProfileController({ entityId, entityType }: ProfileControllerProps) {
  const apiPath = entityType === "volunteer" ? `${apiPathVolunteer}${entityId}` : `/${apiPathOpportunity}/${entityId}`;

  const { data, isLoading, isError, error } = useGetQuery<ApiVolunteerGet | ApiOpportunityGet>({
    queryKey: [entityType, entityId],
    apiPath,
    staleTime: cacheTTL,
  });

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

  return <ProfilePage data={data} entityType={entityType} />;
}
