export type DocumentStatus = "uploaded" | "missing";

export type Document = {
  id: string;
  name: string;
  status: DocumentStatus;
  uploadedOn?: string;
};
