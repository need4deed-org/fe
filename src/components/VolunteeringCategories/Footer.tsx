import { routes } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { Button } from "../core/button";
import { BaseFooterContainer } from "../styled/container";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  return (
    <BaseFooterContainer id="footer-container">
      <Button
        onClick={() => {
          router.push(routes.volunteer(i18n.language));
        }}
        text={t("website.volunteeringCategories.footerButton")}
      />
    </BaseFooterContainer>
  );
}
