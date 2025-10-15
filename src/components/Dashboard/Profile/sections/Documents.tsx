"use client";

import styled from "styled-components";
import { ClipboardText, Eye, DownloadSimple, Trash } from "@phosphor-icons/react";
import type { Document } from "../types/types";

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3b87;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3b87;

  &:last-child {
    text-align: right;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #111827;

  &:last-child {
    text-align: right;
  }
`;

const StatusBadge = styled.span<{ $status: "uploaded" | "missing" }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  text-transform: capitalize;

  ${({ $status }) => {
    switch ($status) {
      case "uploaded":
        return `
          background: #f0fdf4;
          color: #15803d;
          border-color: #bbf7d0;
        `;
      case "missing":
        return `
          background: #fff7ed;
          color: #c2410c;
          border-color: #fed7aa;
        `;
    }
  }}
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const IconButton = styled.button<{ $disabled?: boolean; $destructive?: boolean }>`
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background 0.2s;
  color: ${({ $destructive }) => ($destructive ? "#ef4444" : "#6b7280")};

  &:hover {
    background: ${({ $destructive }) => ($destructive ? "#fee2e2" : "#f3f4f6")};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

interface DocumentsProps {
  documents: Document[];
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function Documents({ documents, onView, onDownload, onDelete }: DocumentsProps) {
  return (
    <Card>
      <Header>
        <ClipboardText size={20} style={{ color: "#E85D75" }} />
        <Title>Documents</Title>
      </Header>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Type of document</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Uploaded on</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell style={{ fontWeight: 500 }}>{document.type}</TableCell>
                <TableCell>
                  <StatusBadge $status={document.status}>{document.status}</StatusBadge>
                </TableCell>
                <TableCell style={{ color: "#6b7280" }}>{document.uploadedOn || "–"}</TableCell>
                <TableCell>
                  <ActionsContainer>
                    <IconButton
                      onClick={() => onView?.(document.id)}
                      disabled={document.status === "missing"}
                      $disabled={document.status === "missing"}
                    >
                      <Eye size={16} />
                    </IconButton>
                    <IconButton
                      onClick={() => onDownload?.(document.id)}
                      disabled={document.status === "missing"}
                      $disabled={document.status === "missing"}
                    >
                      <DownloadSimple size={16} />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete?.(document.id)}
                      disabled={document.status === "missing"}
                      $disabled={document.status === "missing"}
                      $destructive
                    >
                      <Trash size={16} />
                    </IconButton>
                  </ActionsContainer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
