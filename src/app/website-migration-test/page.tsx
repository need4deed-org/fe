"use client";

import { SubPageLayout } from "@/components/Layout/subPageLayout";
import { Heading2 } from "@/components/styled/text";
import styled from "styled-components";

const TestPageContainer = styled.div`
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

export default function TestPage() {
  return (
    <SubPageLayout>
      <TestPageContainer>
        <Heading2>This is a test page...</Heading2>
      </TestPageContainer>
    </SubPageLayout>
  );
}
