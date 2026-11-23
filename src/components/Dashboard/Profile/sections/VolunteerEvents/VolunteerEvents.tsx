import { Checkbox } from "@/components/core/button/Checkbox/Checkbox";
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@/components/core/common/Table";
import { useSetAttended, useVolunteerEvents } from "@/hooks/useEventRegistrations";
import { useTranslation } from "react-i18next";
import { SectionEmptyState, SectionWrapper } from "../shared/styles";
import { formatDate } from "../shared/utils/formatDate";
import { VolunteerActivityLogTableContainer } from "../VolunteerActivityLog/styles";

export const VolunteerEvents = ({ volunteerId }: { volunteerId: number }) => {
  const { t } = useTranslation();
  const { data: events = [], isLoading, isError } = useVolunteerEvents(volunteerId);
  const { mutate: setAttended, isPending } = useSetAttended();

  const emptyText = isLoading
    ? t("dashboard.home.content.loading")
    : isError
      ? t("dashboard.volunteerEvents.loadError")
      : events.length === 0
        ? t("dashboard.volunteerEvents.emptyState")
        : null;

  if (emptyText) {
    return (
      <SectionWrapper>
        <SectionEmptyState>{emptyText}</SectionEmptyState>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <VolunteerActivityLogTableContainer>
        <Table>
          <TableHeader>
            <TableHeaderCell>{t("dashboard.volunteerEvents.event")}</TableHeaderCell>
            <TableHeaderCell $width="140px">{t("dashboard.volunteerEvents.date")}</TableHeaderCell>
            <TableHeaderCell $width="110px">{t("dashboard.volunteerEvents.attended")}</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={event.registrationId} $isLast={index === events.length - 1}>
                <TableCell>{event.title}</TableCell>
                <TableCell $width="140px" $noWrap>
                  {formatDate(event.date)}
                </TableCell>
                <TableCell $width="110px">
                  <Checkbox
                    width="20px"
                    height="20px"
                    checked={event.attended}
                    onChange={(attended) =>
                      !isPending && setAttended({ registrationId: event.registrationId, attended })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </VolunteerActivityLogTableContainer>
    </SectionWrapper>
  );
};
