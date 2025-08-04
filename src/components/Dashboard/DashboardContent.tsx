import React from "react";
import { Heading2 } from "../styled/text";
import styled from "styled-components";

const DashboardContentContainer = styled.div`
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

export default function DashboardContent() {
  return (
    <DashboardContentContainer>
      <Heading2>Dashboard Content...</Heading2>
    </DashboardContentContainer>
  );
}
