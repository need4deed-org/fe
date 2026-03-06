import { Icon, MapPinIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

import { IconDiv } from "@/components/styled/container";
import { Paragraph } from "@/components/styled/text";

import { DetailHeader, DetailSection } from "./accordionStyles";

export interface InfoSectionProps {
  icon: Icon;
  title: string;
  children: ReactNode;
}

export const InfoSection = ({ icon: IconComponent, title, children }: InfoSectionProps) => (
  <DetailSection>
    <DetailHeader>
      <IconDiv size="var(--volunteer-profile-opportunities-accordion-info-section-icon-size)">
        <IconComponent weight={IconComponent === MapPinIcon ? "fill" : "regular"} />
      </IconDiv>
      <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-mid-font)">{title}</Paragraph>
    </DetailHeader>

    {children}
  </DetailSection>
);
