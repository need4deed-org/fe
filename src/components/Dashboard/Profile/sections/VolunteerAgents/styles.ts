import { Heading4 } from "@/components/styled/text";
import styled from "styled-components";

export const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--color-white);
  padding: var(--volunteer-profile-opportunities-accordion-container-padding);
  border-radius: var(--volunteer-profile-opportunities-accordion-container-border-radius);
  border: var(--volunteer-profile-opportunities-accordion-container-border);
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const HeaderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--volunteer-profile-opportunities-accordion-header-info-gap);
`;

export const HeaderInfoAvatarNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-header-avatar-name-gap);
  align-self: stretch;
`;

export const HeaderButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-header-buttons-gap);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--volunteer-profile-opportunities-accordion-container-gap);
`;

export const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--volunteer-profile-opportunities-accordion-split-container-gap);
`;

export const VolunteerOpportunitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-container-gap);
`;

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--volunteer-profile-opportunities-accordion-detail-section-gap);
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-accordion-detail-header-gap);
`;

export const LanguagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;

export const LanguageRow = styled.div`
  display: flex;
  gap: var(--volunteer-profile-opportunities-accordion-language-row-gap);
`;

export const Actions = styled.div`
  display: flex;
  gap: var(--volunteer-profile-opportunities-accordion-actions-container-gap);
  justify-content: center;
`;

export const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--volunteer-profile-opportunities-tab-count-badge-min-width);
  height: var(--volunteer-profile-opportunities-tab-count-badge-height);
  padding: var(--volunteer-profile-opportunities-tab-count-badge-padding);
  border-radius: var(--volunteer-profile-opportunities-tab-count-badge-border-radius);
  background: var(--volunteer-profile-opportunities-tab-count-badge-background);
  color: var(--volunteer-profile-opportunities-tab-count-badge-color);
  font-size: var(--volunteer-profile-opportunities-tab-count-badge-font-size);
  font-weight: var(--volunteer-profile-opportunities-tab-count-badge-font-weight);
  line-height: var(--volunteer-profile-opportunities-tab-count-badge-line-height);
`;

export const TabsContainer = styled.div`
  display: flex;
  margin-top: var(--volunteer-profile-opportunities-tabs-margin-top);
  gap: var(--volunteer-profile-opportunities-tabs-gap);
  border-bottom: var(--volunteer-profile-opportunities-tabs-border-bottom);
`;

type TabHeadingProps = {
  $isSelected: boolean;
};

export const TabHeading = styled(Heading4)<TabHeadingProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-opportunities-tab-heading-gap);
  border-bottom: ${(props) =>
    props.$isSelected ? "var(--volunteer-profile-opportunities-tab-heading-border-bottom)" : "none"};
  color: ${(props) => (props.$isSelected ? "var(--color-violet-500)" : "none")};
  padding: var(--volunteer-profile-opportunities-tab-heading-padding);
  margin: var(--volunteer-profile-opportunities-tab-heading-margin);
`;
