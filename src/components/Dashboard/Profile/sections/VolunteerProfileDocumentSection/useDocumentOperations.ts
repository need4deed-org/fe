import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentType } from "need4deed-sdk";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, UploadDocumentPayload>({
    mutationFn: async ({ file, documentType }) => {
      const meta = await getUploadMeta(
        volunteerId,
        file.type,
        file.name,
        documentType
      );
      await uploadToS3(meta.url, meta.fields, file);
    },
    onSuccess: () => {
      toast.success(t("message.uploadSuccess"));
      queryClient.invalidateQueries({
        queryKey: ["volunteerDocuments", volunteerId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      let errorMessage = t("message.uploadError");
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string } | undefined;
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      }
      toast.error(errorMessage);
    },
  });
};

export const useDeleteDocument = (volunteerId: number, onSuccess?: () => void) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, DeleteDocumentPayload>({
    mutationFn: ({ documentType }) => deleteDocumentApi(volunteerId, documentType),
    onSuccess: () => {
      toast.success(t("message.deleteSuccess"));
      queryClient.invalidateQueries({
        queryKey: ["volunteerDocuments", volunteerId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      let errorMessage = t("message.deleteError");
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string } | undefined;
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      }
      toast.error(errorMessage);
    },
  });
};
