import axiosInstance from "@/middleware/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface UpdateMutationProps<T> {
  url: string;
  data: T;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

const updateData = async <T>(url: string, data: T) => {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(url, data, {});
  return response.data;
};

export const useUpdateMutation = <T>() => {
  const { t } = useTranslation();

  return useMutation<ApiResponse<T>, Error, UpdateMutationProps<T>>(
    async ({ url, data }: UpdateMutationProps<T>) => updateData<T>(url, data),
    {
      onSuccess: (data) => {
        console.log("Update successful:", data);
        toast.success(data.message || t("message.updateSuccess"));
      },
      onError: (error) => {
        console.log("Update error:", error);
        let errorMessage = t("message.errorGeneric");

        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data;
          errorMessage = errorData?.message || errorData;
        } else if (error) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    },
  );
};
