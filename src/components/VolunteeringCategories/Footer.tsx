import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Subpage } from "@/types";

import { Button } from "../core/button";
import { BaseFooterContainer } from "../styled/container";

export default function Footer() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <BaseFooterContainer id="footer-container">
      <Button
        onClick={() => {
          router.push(`/${Subpage.OPPORTUNITY_CARDS}`);
        }}
        text={t("homepage.volunteeringCategories.footerButton")}
      />
    </BaseFooterContainer>
  );
}
