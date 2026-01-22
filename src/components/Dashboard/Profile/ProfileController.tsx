import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiVolunteerGet } from "need4deed-sdk";
import ProfilePage from "./ProfilePage";
import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { Paragraph } from "@/components/styled/text";
import styled from "styled-components";

const LoadingContainer = styled(CenteredWrapper)`
  padding: 2rem;
`;

const ErrorContainer = styled(CenteredWrapper)`
  padding: 2rem;
  color: var(--color-red-600);
`;

export function ProfileController({ volunteerId }: { volunteerId: string }) {
  const { data, isLoading, isError, error } = useGetQuery<ApiVolunteerGet>({
    queryKey: ["volunteer", volunteerId],
    apiPath: `${apiPathVolunteer}${volunteerId}`,
    staleTime: cacheTTL,
  });

  if (isLoading) {
    return (
      <LoadingContainer>
        <Paragraph>Loading volunteer profile...</Paragraph>
      </LoadingContainer>
    );
  }

  if (isError) {
    let errorMessage = "Failed to load volunteer profile. Please try again.";
    
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
        <Paragraph>No volunteer data available.</Paragraph>
      </ErrorContainer>
    );
  }

  return <ProfilePage volunteer={data} />;
}
