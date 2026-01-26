"use client";
import { ReactNode } from "react";
import styled from "styled-components";

export const Card = styled.div`
  background-color: var(--color-white);
  border-radius: var(--volunteer-profile-section-card-border-radius);
  padding: var(--volunteer-profile-section-card-padding);
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-section-card-gap);
`;

interface ProfileHeaderProps {
  children: ReactNode;
}

export const ProfileHeader = ({ children }: ProfileHeaderProps) => {
  return (
    <HeaderContainer data-testid="profile-header">
      <Card>{children}</Card>
    </HeaderContainer>
  );
};
