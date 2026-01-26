import { ApiDocumentGet, DocumentType } from "need4deed-sdk";

export type EnrichedDocument = ApiDocumentGet & {
  nameKey: string;
  isUploaded: boolean;
};

export type DocumentRow = {
  type: DocumentType;
  nameKey: string;
  isUploaded: boolean;
  document?: ApiDocumentGet;
};

const DOCUMENT_NAME_KEYS: Record<DocumentType, string> = {
  "measles-vacc-cert": "measlesVaccination",
  "CGC-application": "applicationCertificateGoodConduct",
  "good-conduct-cert": "certificateGoodConduct",
  "passport-copy": "passport",
};

export const getDocumentNameKey = (type: DocumentType): string => {
  return DOCUMENT_NAME_KEYS[type];
};

export const formatDocumentDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const extractDocumentUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("url");
  } catch {
    return null;
  }
};

export const enrichDocuments = (
  fetchedDocuments: ApiDocumentGet[]
): DocumentRow[] => {
  const allTypes = Object.keys(DOCUMENT_NAME_KEYS) as DocumentType[];

  return allTypes.map((type) => {
    const document = fetchedDocuments.find((doc) => doc.type === type);
    return {
      type,
      nameKey: DOCUMENT_NAME_KEYS[type],
      isUploaded: !!document,
      document,
    };
  });
};
