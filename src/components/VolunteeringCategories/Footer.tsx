import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { Button } from "../core/button";
import { Subpage } from "@/types";
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
