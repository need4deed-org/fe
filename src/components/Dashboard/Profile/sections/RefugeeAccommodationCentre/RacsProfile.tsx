"use client";

import { DashboardLayout } from "@/components/Layout";
import React, { useState } from "react";
import { SectionCard } from "../../common/SectionCard";
import { IconName } from "../../types/types";
import { t } from "i18next";
import { RacContactDetails } from "./RacContactDetails";
import { ApiPersonGet } from "need4deed-sdk";

type Props = {
  person: ApiPersonGet | undefined;
};

export default function RacsProfile({ person }: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <SectionCard
        iconName={IconName.ChatsCircle}
        title={"Contact Details"}
        subComponent={
          <RacContactDetails
            person={person}
            isEditing={isEditing}
            handleEditClick={handleEditClick}
            handleCancelClick={handleCancelClick}
          />
        }
        headerButtonName={t("dashboard.rac.editButtonName")}
        onHeaderButtonClick={() => setIsEditing(true)}
      />
    </DashboardLayout>
  );
}
