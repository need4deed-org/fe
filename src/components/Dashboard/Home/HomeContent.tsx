import { Heading2 } from "@/components/styled/text";
import React from "react";
import styled from "styled-components";

const DashboardContentContainer = styled.div`
  display: flex;
  height: 300px;
`;

export default function DashboardHomeContent() {
  return (
    <DashboardContentContainer>
      <Heading2>Dashboard Content...</Heading2>
    </DashboardContentContainer>
  );
}
