export type DocumentStatus = "uploaded" | "missing";

export type Document = {
  id: string;
  nameKey: string;
  status: DocumentStatus;
  uploadedOn?: string;
};
