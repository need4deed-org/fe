import { Heading4 } from "@/components/styled/text";
import { ChatCircleIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { startOfWeek } from "date-fns";
import { TFunction } from "i18next";
import Link from "next/link";
import { ApiMyActivityItem, MyActivityKind } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { useGetMyActivity } from "@/hooks/useGetMyActivity";
import { formatDateTime } from "../../Profile/sections/shared/utils/formatDateTime";
import { formatActivityDetail } from "../../Profile/sections/VolunteerActivityLog/format-activity-detail";
import { processEntity } from "../helpers";
import { ActivityDate, EarlierActivity, TagContainer, TagRow } from "../styles";

const MENTION_TOKEN = /<@\d+>\s*/g;

function activityText(item: ApiMyActivityItem, t: TFunction): string {
  if (item.kind === MyActivityKind.CHANGE && item.changeType) {
    return formatActivityDetail({ type: item.changeType, detail: item.text }, t);
  }
  return item.text.replace(MENTION_TOKEN, "");
}

function ActivityRow({ item }: { item: ApiMyActivityItem }) {
  const { t, i18n } = useTranslation();
  const Icon = item.kind === MyActivityKind.COMMENT ? ChatCircleIcon : PencilSimpleIcon;

  return (
    <TagRow $isRead>
      <Link href={`/${i18n.language}${processEntity[item.entityType].linkUrl}/${item.entityId}`}>
        <Icon size={22} />
        <Heading4>
          <strong>{item.entityTitle}</strong>: {activityText(item, t)}
        </Heading4>
        <ActivityDate>{formatDateTime(new Date(item.occurredAt))}</ActivityDate>
      </Link>
    </TagRow>
  );
}

export function MyRecentActivity() {
  const { t } = useTranslation();
  const { activity, isLoading } = useGetMyActivity();

  if (isLoading) {
    return <Heading4>{t("dashboard.home.content.loading")}</Heading4>;
  }
  if (activity.length === 0) {
    return <Heading4>{t("dashboard.home.content.noActivity")}</Heading4>;
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeek = activity.filter((item) => new Date(item.occurredAt) >= weekStart);
  const earlier = activity.filter((item) => new Date(item.occurredAt) < weekStart);

  return (
    <TagContainer>
      {thisWeek.length === 0 && <Heading4>{t("dashboard.home.content.noActivityThisWeek")}</Heading4>}
      {thisWeek.map((item) => (
        <ActivityRow key={item.id} item={item} />
      ))}
      {earlier.length > 0 && (
        <EarlierActivity>
          <summary>{t("dashboard.home.content.earlierActivity", { count: earlier.length })}</summary>
          {earlier.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </EarlierActivity>
      )}
    </TagContainer>
  );
}
