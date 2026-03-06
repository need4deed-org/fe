import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";

import { Actions } from "./accordionStyles";

interface AccordionActionsProps {
  onNotAMatch?: () => void;
  onMatch?: () => void;
  onMarkAsActive?: () => void;
  onMarkAsPast?: () => void;
}

export const AccordionActions = ({ onNotAMatch, onMatch, onMarkAsActive, onMarkAsPast }: AccordionActionsProps) => {
  const { t } = useTranslation();

  return (
    <Actions>
      {onNotAMatch && (
        <Button
          onClick={onNotAMatch}
          text={t("dashboard.opportunityProfile.volunteersSec.notAMatch")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
          textColor="var(--color-aubergine)"
          backgroundcolor="var(--color-white)"
          border="var(--volunteer-profile-opportunities-accordion-actions-button-border)"
        />
      )}
      {onMatch && (
        <Button
          onClick={onMatch}
          text={t("dashboard.volunteerProfile.opportunitiesSec.match")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        />
      )}
      {onMarkAsActive && (
        <Button
          onClick={onMarkAsActive}
          text={t("dashboard.opportunityProfile.volunteersSec.markAsActive")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        />
      )}
      {onMarkAsPast && (
        <Button
          onClick={onMarkAsPast}
          text={t("dashboard.opportunityProfile.volunteersSec.markAsPast")}
          height="var(--volunteer-profile-opportunities-accordion-actions-button-height)"
          textFontSize="var(--volunteer-profile-opportunities-accordion-actions-button-textFontSize)"
        />
      )}
    </Actions>
  );
};
