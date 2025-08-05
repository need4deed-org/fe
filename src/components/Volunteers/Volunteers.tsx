"use client";

import styled from "styled-components";
import { SubPageLayout } from "../Layout/subPageLayout";
import Header from "./Header";
import { useTranslation } from "react-i18next";

const VolunteersContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: var(--dashboard-volunteers-container-padding);
  padding: var(--dashboard-volunteers-container-gap);
`;

export function Volunteers() {
  const { t } = useTranslation();

  const tabs = [t("dashboard.volunteers.tabs.tab1"), t("dashboard.volunteers.tabs.tab2")];

  return (
    <SubPageLayout background="var(--color-white)">
      <VolunteersContainer>
        <Header tabs={tabs} />
      </VolunteersContainer>
    </SubPageLayout>
  );
}

export default Volunteers;
