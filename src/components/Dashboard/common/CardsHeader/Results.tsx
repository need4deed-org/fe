import { Heading4, Paragraph } from "@/components/styled/text";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-volunteers-header-result-gap);
  gap: var(--dashboard-volunteers-header-result-padding);
`;

interface Props {
  counter: number;
  text: string;
}

export default function Results({ counter, text }: Props) {
  const { t } = useTranslation();

  return (
    <ResultContainer>
      <Heading4>{counter}</Heading4>
      <Paragraph>{text + " " + t("dashboard.found")}</Paragraph>
    </ResultContainer>
  );
}
