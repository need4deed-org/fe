"use client";
import { FlexColumn } from "@/components/styled/FlexColumn";
import { ReactNode } from "react";
import { Card, ProfileContent, ProfileInfo, StatusSection, Subtitle, Title, TitleSection } from "./profileHeaderStyles";

type Props = {
  testId: string;
  avatar: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
  after?: ReactNode;
};

export const HeaderCard = ({ testId, avatar, title, subtitle, children, after }: Props) => (
  <FlexColumn data-testid={testId}>
    <Card>
      <ProfileContent>
        {avatar}
        <ProfileInfo>
          <TitleSection>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </TitleSection>
          <StatusSection data-testid={`${testId}-status-section`}>{children}</StatusSection>
        </ProfileInfo>
      </ProfileContent>
    </Card>
    {after}
  </FlexColumn>
);
