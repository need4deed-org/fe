import { IconDiv } from "@/components/styled/container";
import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { iconNameMap } from "./icon";
import { IconName } from "../types/types";
import { Heading2 } from "@/components/styled/text";
import { Button } from "@/components/core/button";

export const Card = styled.div`
  background-color: var(--color-white);
  border-radius: var(--volunteer-profile-section-card-border-radius);
  padding: var(--volunteer-profile-section-card-padding);
  gap: var(--volunteer-profile-section-card-gap);
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-section-card-header-info-gap);
`;

export interface SectionCardProps extends PropsWithChildren {
  iconName: IconName;
  title: string;
  headerButtonName?: string;
  subComponent: ReactNode;
}

export const SectionCard = ({ iconName, title, headerButtonName, subComponent }: SectionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardHeaderInfo>
          <IconDiv size="var(--volunteer-profile-section-card-icon-size)">{iconNameMap[iconName]}</IconDiv>
          <Heading2>{title}</Heading2>
        </CardHeaderInfo>

        {headerButtonName && (
          <Button
            onClick={() => {}}
            text={headerButtonName}
            height="var(--volunteer-profile-section-card-header-button-height)"
            textFontSize="var(--volunteer-profile-section-card-header-button-textFontSize)"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
          />
        )}
      </CardHeader>

      {subComponent}
    </Card>
  );
};
