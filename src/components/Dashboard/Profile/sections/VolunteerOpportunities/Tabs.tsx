import { Heading4 } from "@/components/styled/text";
import styled from "styled-components";

interface Props {
  tabs: string[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
}

export const Tabs = ({ selectedTabIndex, setSelectedTabIndex, tabs }: Props) => {
  return (
    <TabsContainer>
      {tabs.map((tab, index) => (
        <TabHeading key={tab} onClick={() => setSelectedTabIndex(index)} $isSelected={selectedTabIndex === index}>
          {tab}
        </TabHeading>
      ))}
    </TabsContainer>
  );
};

/* Styles */

const TabsContainer = styled.div`
  display: flex;
  margin-top: var(--volunteer-profile-opportunities-tabs-margin-top);
  gap: var(--volunteer-profile-opportunities-tabs-gap);
  border-bottom: var(--volunteer-profile-opportunities-tabs-border-bottom);
`;

interface TabHeadingProps {
  $isSelected: boolean;
}

const TabHeading = styled(Heading4)<TabHeadingProps>`
  cursor: pointer;
  border-bottom: ${(props) =>
    props.$isSelected ? "var(--volunteer-profile-opportunities-tab-heading-border-bottom)" : "none"};
  color: ${(props) => (props.$isSelected ? "var(--color-violet-500)" : "none")};
  padding: var(--volunteer-profile-opportunities-tab-heading-padding);
  margin: var(--volunteer-profile-opportunities-tab-heading-margin);
`;
