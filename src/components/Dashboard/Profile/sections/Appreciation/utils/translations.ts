import { TFunction } from "i18next";
import { VolunteerStateAppreciationType } from "need4deed-sdk";

export const getAppreciationTypeLabel = (
  t: TFunction,
  type: VolunteerStateAppreciationType,
): string => {
  const map: Record<VolunteerStateAppreciationType, string> = {
    [VolunteerStateAppreciationType.T_SHIRT]:
      "dashboard.appreciationSection.typeOptions.tshirt",
    [VolunteerStateAppreciationType.TOTE_BAG]:
      "dashboard.appreciationSection.typeOptions.toteBag",
    [VolunteerStateAppreciationType.BENEFIT_CARD]:
      "dashboard.appreciationSection.typeOptions.benefitCard",
  };
  return t(map[type] || type);
};
