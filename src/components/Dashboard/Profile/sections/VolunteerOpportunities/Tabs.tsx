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
  margin-top: 16px;
  gap: 24px;
  border-bottom: 1px solid var(--color-blue-50);
`;

interface TabHeadingProps {
  $isSelected: boolean;
}

const TabHeading = styled(Heading4)<TabHeadingProps>`
  cursor: pointer;
  border-bottom: ${(props) => (props.$isSelected ? "2px solid currentColor" : "none")};
  color: ${(props) => (props.$isSelected ? "var(--color-violet-500)" : "none")};
  padding: 16px;
  margin: 0;
`;
