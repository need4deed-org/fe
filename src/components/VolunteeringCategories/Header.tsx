import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Heading2, Paragraph } from "../styled/text";
import { SectionHeaderContainer } from "../styled/container";

const HeaderContainer = styled(SectionHeaderContainer)`
  gap: var(--homepage-volunteering-categories-header-gap);
`;

function HeadingSection() {
  const { t } = useTranslation();

  return (
    <HeaderContainer id="header-container">
      <Heading2>{t("homepage.volunteeringCategories.header")}</Heading2>
      <Paragraph>{t("homepage.volunteeringCategories.headerParagraph")}</Paragraph>
    </HeaderContainer>
  );
}

export default HeadingSection;
