import { TFunction } from "i18next";
import { Column } from "../common/EntityTableList";

export const createVolunteerTableColumns = (t: TFunction): Column[] => [
  { key: "name", label: t("dashboard.volunteers.table.name") },
  { key: "type", label: t("dashboard.volunteers.table.type"), width: "180px" },
  { key: "engagement", label: t("dashboard.volunteers.table.engagementStatus"), width: "200px" },
  { key: "matching", label: t("dashboard.volunteers.table.matchingStatus"), width: "140px" },
  { key: "language", label: t("dashboard.volunteers.table.language"), width: "180px" },
  { key: "district", label: t("dashboard.volunteers.table.district"), width: "200px" },
  { key: "email", label: t("dashboard.volunteers.table.email") },
];
