import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { Paragraph } from "@/components/styled/text";
import { ReactNode } from "react";
import styled from "styled-components";
import { EntityType } from "./types";

const LoadingContainer = styled(CenteredWrapper)`
  padding: var(--volunteer-profile-loading-error-wrapper-padding);
`;

const ErrorContainer = styled(CenteredWrapper)`
  padding: var(--volunteer-profile-loading-error-wrapper-padding);
  color: var(--color-red-600);
`;

type Props = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data: unknown;
  entityType: EntityType;
  children: ReactNode;
};

export const LoadingErrorWrapper = ({ isLoading, isError, error, data, entityType, children }: Props) => {
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
