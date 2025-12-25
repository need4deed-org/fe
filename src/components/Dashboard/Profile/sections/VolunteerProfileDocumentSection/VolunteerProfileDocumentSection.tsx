"use client";
import { Heading2 } from "@/components/styled/text";
import { ClipboardText, DownloadSimple, Eye, Trash } from "@phosphor-icons/react";
import { ApiVolunteerGet } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ActionCell,
  Cell,
  Container,
  Header,
  HeaderCell,
  IconContainer,
  StatusBadge,
  Table,
  TableHeader,
  TableRow,
  TitleRow,
} from "./styles";
import { Document } from "./types";

type Props = {
  volunteer: ApiVolunteerGet;
};

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Measles vaccination",
    status: "uploaded",
    uploadedOn: "21.03.2025",
  },
  {
    id: "2",
    name: "Application for certificate of good conduct",
    status: "uploaded",
    uploadedOn: "22.03.2025",
  },
  {
    id: "3",
    name: "Certificate of good conduct",
    status: "missing",
  },
  {
    id: "4",
    name: "Passport",
    status: "missing",
  },
];

export function VolunteerProfileDocumentSection({ volunteer }: Props) {
  const { t } = useTranslation();

  const handleView = (documentId: string) => {
    console.log("View document:", documentId);
  };

  const handleDownload = (documentId: string) => {
    console.log("Download document:", documentId);
  };

  const handleDelete = (documentId: string) => {
    console.log("Delete document:", documentId);
  };

  return (
    <Container data-testid="volunteer-profile-document-section-container">
      <Header>
        <TitleRow>
          <IconContainer>
            <ClipboardText size={40} weight="fill" />
          </IconContainer>
          <Heading2>{t("dashboard.volunteerProfile.documentSection.title")}</Heading2>
        </TitleRow>
      </Header>

      <Table>
        <TableHeader>
          <HeaderCell>{t("dashboard.volunteerProfile.documentSection.typeOfDocument")}</HeaderCell>
          <HeaderCell $width="145px">{t("dashboard.volunteerProfile.documentSection.status")}</HeaderCell>
          <HeaderCell $width="180px">{t("dashboard.volunteerProfile.documentSection.uploadedOn")}</HeaderCell>
          <HeaderCell $width="56px"></HeaderCell>
          <HeaderCell $width="56px"></HeaderCell>
          <HeaderCell $width="56px"></HeaderCell>
        </TableHeader>

        {MOCK_DOCUMENTS.map((doc, index) => (
          <TableRow key={doc.id} $isLast={index === MOCK_DOCUMENTS.length - 1}>
            <Cell>{doc.name}</Cell>
            <Cell $width="145px" $align="center">
              <StatusBadge $status={doc.status}>
                {doc.status === "uploaded"
                  ? t("dashboard.volunteerProfile.documentSection.uploaded")
                  : t("dashboard.volunteerProfile.documentSection.missing")}
              </StatusBadge>
            </Cell>
            <Cell $width="180px" $noWrap>
              {doc.uploadedOn || "–"}
            </Cell>
            <ActionCell $width="56px" $align="center">
              <ActionButton
                onClick={() => handleView(doc.id)}
                $disabled={doc.status === "missing"}
                disabled={doc.status === "missing"}
                aria-label="View document"
              >
                <Eye size={24} weight="regular" />
              </ActionButton>
            </ActionCell>
            <ActionCell $width="56px" $align="center">
              <ActionButton
                onClick={() => handleDownload(doc.id)}
                $disabled={doc.status === "missing"}
                disabled={doc.status === "missing"}
                aria-label="Download document"
              >
                <DownloadSimple size={24} weight="regular" />
              </ActionButton>
            </ActionCell>
            <ActionCell $width="56px" $align="center">
              <ActionButton
                onClick={() => handleDelete(doc.id)}
                $disabled={doc.status === "missing"}
                disabled={doc.status === "missing"}
                aria-label="Delete document"
              >
                <Trash size={24} weight="regular" />
              </ActionButton>
            </ActionCell>
          </TableRow>
        ))}
      </Table>
    </Container>
  );
}
