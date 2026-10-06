import { TabHeading, Tabs } from "./styles";

type Props = {
  tabs: string[];
  selectedTabIndex: number;
  onTabChange: (index: number) => void;
};

export function HeaderTabs({ tabs, selectedTabIndex, onTabChange }: Props) {
  return (
    <Tabs role="tablist">
      {tabs.map((tab, index) => (
        <TabHeading
          type="button"
          role="tab"
          aria-selected={selectedTabIndex === index}
          key={tab}
          onClick={() => onTabChange(index)}
          $isSelected={selectedTabIndex === index}
        >
          {tab}
        </TabHeading>
      ))}
    </Tabs>
  );
}

export default HeaderTabs;
