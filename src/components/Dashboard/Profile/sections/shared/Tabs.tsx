import { CountBadge, TabHeading, TabsContainer } from "./tabStyles";

type Tab = { label: string; count?: number };

type Props = {
  tabs: Tab[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
};

export const Tabs = ({ selectedTabIndex, setSelectedTabIndex, tabs }: Props) => {
  return (
    <TabsContainer data-testid="tabs">
      {tabs.map((tab, index) => (
        <TabHeading key={tab.label} onClick={() => setSelectedTabIndex(index)} $isSelected={selectedTabIndex === index}>
          {tab.label}
          {tab.count !== undefined && <CountBadge>{tab.count}</CountBadge>}
        </TabHeading>
      ))}
    </TabsContainer>
  );
};
