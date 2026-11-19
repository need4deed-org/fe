import { Checkbox } from "@/components/core/button/Checkbox/Checkbox";
import { Table, TableBody, TableCell, TableHeaderCell } from "@/components/core/common/Table";
import { useSetAttended, useVolunteerEvents } from "@/hooks/useEventRegistrations";
import { useTranslation } from "react-i18next";
import { SectionEmptyState, SectionWrapper } from "../shared/styles";
import { formatDate } from "../shared/utils/formatDate";
import { VolunteerActivityLogTableContainer } from "../VolunteerActivityLog/styles";
import { TableHeader, TableRow } from "../VolunteerProfileDocument/styles";

export const VolunteerEvents = ({ volunteerId }: { volunteerId: number }) => {
  const { t } = useTranslation();
  const { data: events = [] } = useVolunteerEvents(volunteerId);
  const { mutate: setAttended } = useSetAttended();

  if (events.length === 0) {
    return (
      <SectionWrapper>
        <SectionEmptyState>{t("dashboard.volunteerEvents.emptyState")}</SectionEmptyState>
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
                    onChange={(attended) => setAttended({ registrationId: event.registrationId, attended })}
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
