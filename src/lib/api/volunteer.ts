import axios from "axios";
import { ApiDocumentGet, DocumentType } from "need4deed-sdk";

const apiPrefix = "/api";

export const getVolunteerDocuments = async (
  volunteerId: number
): Promise<ApiDocumentGet[]> => {
  const response = await axios.get(`${apiPrefix}/volunteer/${volunteerId}/doc`);
  return response.data.data;
};

export const getUploadMeta = async (
  volunteerId: number,
  mimeType: string,
  originalName: string,
  type: DocumentType
) => {
  const response = await axios.get(
    `${apiPrefix}/volunteer/${volunteerId}/doc/upload-meta`,
    {
      params: {
        mimeType,
        originalName,
        type,
      },
    }
  );
  return response.data;
};

export const uploadDocument = async (
  url: string,
  fields: any,
  file: File
) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);

  // The URL from getUploadMeta is a full URL to the S3 mock, so we don't need to prefix it
  const response = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteDocument = async (
  volunteerId: number,
  type: DocumentType
) => {
  const response = await axios.delete(
    `${apiPrefix}/volunteer/${volunteerId}/doc/${type}`
  );
  return response.data;
};