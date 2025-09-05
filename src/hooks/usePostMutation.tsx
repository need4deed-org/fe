import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface PostMutationOptions<TData, TResponse> {
  apiPath: string;
  successMessage?: string;
  onSuccessCallback?: (data: TResponse) => void;
}

export const usePostMutation = <TData, TResponse, TError = Error>({
  apiPath,
  successMessage,
  onSuccessCallback,
}: PostMutationOptions<TData, TResponse>) => {
  const { t } = useTranslation();

  return useMutation<TResponse, TError, TData>({
    mutationFn: async (data) => {
      const response = await axios.post(apiPath, data);
      return response.data;
    },

    onSuccess: (responseData) => {
      toast.success(t(successMessage || "message.successful") + " 🎉");

      if (onSuccessCallback) onSuccessCallback(responseData);
    },

    onError: (error) => {
      let errorMessage = t("message.errorGeneric");

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        errorMessage = errorData?.message || errorData;
      }

      toast.error(errorMessage);
    },
  });
};

export default usePostMutation;
