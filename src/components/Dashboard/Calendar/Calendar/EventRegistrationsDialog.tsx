import { Checkbox } from "@/components/core/button/Checkbox/Checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableHeaderCell,
  TableRow,
  WrappedText,
} from "@/components/core/common/Table";
import { Modal } from "@/components/core/modal/Modal";
import { Heading3, Paragraph } from "@/components/styled/text";
import { DashboardRoutes } from "@/config/constants";
import { useEventRegistrations, useExportEventRegistrations, useSetAttended } from "@/hooks/useEventRegistrations";
import type { ApiEventN4DGetList, ApiEventN4DRegistrationGet } from "need4deed-sdk";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type Props = {
  event: ApiEventN4DGetList;
  onClose: () => void;
};

const ExportButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-12) 0;
`;

export function EventRegistrationsDialog({ event, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useEventRegistrations(event.id);
  const { mutate: setAttended, isPending: isSavingAttended } = useSetAttended();
  const { mutate: exportCsv, isPending: isExporting } = useExportEventRegistrations(event.id);
  const registrations = data?.registrations ?? [];

  const volunteerCell = (registration: ApiEventN4DRegistrationGet) => {
    if (!registration.isVolunteer) return t("eventRegistration.no");
    const kinds = registration.volunteerTypes.map((type) => t(`eventRegistration.volunteerTypes.${type}`)).join(", ");
    const label = kinds || t("eventRegistration.yes");
    return registration.volunteerId ? (
      <Link href={`/${i18n.language}${DashboardRoutes.Volunteers}/${registration.volunteerId}`}>{label}</Link>
    ) : (
      label
    );
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Heading3>{t("dashboard.calendar.registrations.title", { title: event.title })}</Heading3>
      <Summary>
        <Paragraph>
          {t("dashboard.calendar.registrations.summary", {
            count: registrations.length,
            people: data?.totalPeople ?? 0,
          })}
        </Paragraph>
        <ExportButton type="button" onClick={() => exportCsv()} disabled={isExporting}>
          {t("dashboard.calendar.registrations.export")}
        </ExportButton>
      </Summary>
      {isLoading ? (
        <Paragraph>{t("dashboard.home.content.loading")}</Paragraph>
      ) : registrations.length === 0 ? (
        <Paragraph>{t("dashboard.calendar.registrations.empty")}</Paragraph>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("eventRegistration.fields.fullName")}</TableHeaderCell>
              <TableHeaderCell>{t("eventRegistration.fields.email")}</TableHeaderCell>
              <TableHeaderCell $width="72px">{t("dashboard.calendar.registrations.people")}</TableHeaderCell>
              <TableHeaderCell>{t("dashboard.calendar.registrations.volunteer")}</TableHeaderCell>
              <TableHeaderCell $width="96px">{t("dashboard.calendar.registrations.attended")}</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {registrations.map((registration, index) => (
                <TableRow key={registration.id} $isLast={index === registrations.length - 1}>
                  <TableCell>
                    <WrappedText title={registration.message ?? undefined}>{registration.fullName}</WrappedText>
                  </TableCell>
                  <TableCell>
                    <WrappedText>{registration.email}</WrappedText>
                  </TableCell>
                  <TableCell $width="72px">{registration.numberOfPeople}</TableCell>
                  <TableCell>{volunteerCell(registration)}</TableCell>
                  <TableCell $width="96px">
                    <Checkbox
                      width="20px"
                      height="20px"
                      checked={registration.attended}
                      onChange={(attended) =>
                        !isSavingAttended && setAttended({ registrationId: registration.id, attended })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Modal>
  );
}
