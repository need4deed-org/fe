import { DocumentType } from "need4deed-sdk";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useMutationQuery } from "@/hooks/useMutationQuery";

type UploadMetaResponse = {
  url: string;
  fields: Record<string, string>;
};

type UploadDocumentPayload = {
  volunteerId: number;
  file: File;
  documentType: DocumentType;
};

type DeleteDocumentPayload = {
  volunteerId: number;
  documentType: DocumentType;
};

const getUploadMeta = async (
  volunteerId: number,
  mimeType: string,
  originalName: string,
  type: DocumentType
): Promise<UploadMetaResponse> => {
  const response = await axios.get(
    `/api/volunteer/${volunteerId}/doc/upload-meta`,
    {
      params: { mimeType, originalName, type },
    }
  );
  return response.data;
};

const uploadToS3 = async (
  url: string,
  fields: Record<string, string>,
  file: File
): Promise<void> => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteDocumentApi = async (
  volunteerId: number,
  documentType: DocumentType
): Promise<void> => {
  await axios.delete(`/api/volunteer/${volunteerId}/doc/${documentType}`);
};

export const useUploadDocument = (volunteerId: number, onSuccess?: () => void) => {
  const { t } = useTranslation();

  const uploadDocumentMutationFn = async ({ file, documentType }: UploadDocumentPayload) => {
    const meta = await getUploadMeta(
      volunteerId,
      file.type,
      file.name,
      documentType
    );
    await uploadToS3(meta.url, meta.fields, file);
  };

  return useMutationQuery<UploadDocumentPayload, void>({
    mutationFn: uploadDocumentMutationFn,
    successMessage: t("message.uploadSuccess"),
    queryKeyToInvalidate: ["volunteerDocuments", volunteerId],
    onSuccessCallback: onSuccess,
  });
};

export const useDeleteDocument = (volunteerId: number, onSuccess?: () => void) => {
  const { t } = useTranslation();

  return useMutationQuery<DeleteDocumentPayload, void>({
    mutationFn: ({ documentType }) => deleteDocumentApi(volunteerId, documentType),
    successMessage: t("message.deleteSuccess"),
    queryKeyToInvalidate: ["volunteerDocuments", volunteerId],
    onSuccessCallback: onSuccess,
  });
};
