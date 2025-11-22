import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Heading4, Paragraph } from "@/components/styled/text";

const ResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--opportunities-header-result-gap);
`;

interface Props {
  counter: number;
  text: string;
}

export default function Results({ counter, text }: Props) {
  const { t } = useTranslation();

  return (
    <ResultContainer>
      <Heading4 margin={0}>{counter}</Heading4>
      <Paragraph>{text + " " + t("dashboard.found")}</Paragraph>
    </ResultContainer>
  );
}
