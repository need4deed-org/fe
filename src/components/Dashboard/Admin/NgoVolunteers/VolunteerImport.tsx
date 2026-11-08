"use client";

import { Button } from "@/components/core/button";
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@/components/core/common/Table";
import { Heading4, Paragraph } from "@/components/styled/text";
import { useImportVolunteers } from "@/hooks/useImportVolunteers";
import { parseVolunteerCsv } from "@/utils/parseVolunteerCsv";
import { ApiVolunteerImportResult, ApiVolunteerImportRow, VOLUNTEER_IMPORT_MAX_ROWS } from "need4deed-sdk";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "./styles";

const i18nPrefix = "dashboard.admin.ngoVolunteers.import";
const HEADER_LINES = 2;

export function VolunteerImport({ agentId }: { agentId: number }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ApiVolunteerImportRow[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [report, setReport] = useState<ApiVolunteerImportResult>();
  const { mutate: runImport, isPending } = useImportVolunteers(agentId, setReport);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    setRows([]);
    setReport(undefined);
    setFileError(undefined);
    const file = event.target.files?.[0];
    if (!file) return;
    const parsed = parseVolunteerCsv(await file.text());
    if (parsed.status === "empty") {
      setFileError(t(`${i18nPrefix}.empty`));
    } else if (parsed.status === "missing-columns") {
      setFileError(t(`${i18nPrefix}.missingColumns`, { columns: parsed.columns.join(", ") }));
    } else if (parsed.rows.length > VOLUNTEER_IMPORT_MAX_ROWS) {
      setFileError(t(`${i18nPrefix}.tooMany`, { max: VOLUNTEER_IMPORT_MAX_ROWS }));
    } else {
      setRows(parsed.rows);
    }
  };

  const canImport = report?.dryRun === true && report.invalid === 0 && report.created > 0;

  return (
    <Section>
      <Heading4 margin={0}>{t(`${i18nPrefix}.title`)}</Heading4>
      <Paragraph>{t(`${i18nPrefix}.helper`)}</Paragraph>
      <input type="file" accept=".csv,text/csv" aria-label={t(`${i18nPrefix}.file`)} onChange={handleFile} />
      {fileError && <Paragraph color="var(--color-red-600)">{fileError}</Paragraph>}
      {rows.length > 0 && <Paragraph>{t(`${i18nPrefix}.rowsLoaded`, { count: rows.length })}</Paragraph>}
      {rows.length > 0 && (
        <Button
          text={t(`${i18nPrefix}.preview`)}
          width="auto"
          disabled={isPending}
          onClick={() => runImport({ rows, dryRun: true })}
        />
      )}
      {canImport && (
        <Button
          text={t(`${i18nPrefix}.import`)}
          width="auto"
          disabled={isPending}
          onClick={() => runImport({ rows })}
        />
      )}
      {report && <ImportReport report={report} />}
    </Section>
  );
}

function ImportReport({ report }: { report: ApiVolunteerImportResult }) {
  const { t } = useTranslation();
  const summaryKey = report.dryRun || report.invalid > 0 ? "summary" : "imported";

  return (
    <>
      <Paragraph>
        {t(`${i18nPrefix}.${summaryKey}`, {
          created: report.created,
          skipped: report.skipped,
          invalid: report.invalid,
        })}
      </Paragraph>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{t(`${i18nPrefix}.line`)}</TableCell>
              <TableCell>{t(`${i18nPrefix}.email`)}</TableCell>
              <TableCell>{t(`${i18nPrefix}.outcome`)}</TableCell>
              <TableCell>{t(`${i18nPrefix}.details`)}</TableCell>
            </TableRow>
            {report.rows.map((row, index) => (
              <TableRow key={row.row} $isLast={index === report.rows.length - 1}>
                <TableCell>{row.row + HEADER_LINES}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{t(`${i18nPrefix}.outcomes.${row.outcome}`)}</TableCell>
                <TableCell>
                  {row.skipReason ? t(`${i18nPrefix}.skipReasons.${row.skipReason}`) : (row.errors ?? []).join("; ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
