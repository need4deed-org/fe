import { DocumentType } from "need4deed-sdk";

export type DocumentStatus = "uploaded" | "missing";

export type Document = {
  id: string;
  nameKey: string;
  status: DocumentStatus;
  uploadedOn?: string;
  type: DocumentType;
  url?: string;
};
