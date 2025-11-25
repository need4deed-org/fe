import { HttpMethod } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";


// Define the options for the hook
interface DataMutationOptions<TResponse> {
  apiPath: string;
  method?: HttpMethod;
  successMessage?: string;
  onSuccessCallback?: (data: TResponse) => void;
  queryKeyToInvalidate?: (string | number)[]; // Optional key to refetch data on success
}

// Generic function to perform the API call
async function mutateData<TData, TResponse>(apiPath: string, method: HttpMethod, data: TData): Promise<TResponse> {
  // Dynamically call the appropriate axios method
  const response = await axios[method.toLowerCase() as HttpMethod](apiPath, data);
  return response.data;
}

/**
 * A generic hook for handling POST, PATCH, and PUT mutations.
 * @param TData The type of the payload sent to the API.
 * @param TResponse The type of the data expected in the API response.
 * @param TError The type of the error object.
 */
export const useMutationQuery = <TData, TResponse, TError = AxiosError<{ message?: string }>>({
  apiPath,
  method = "post",
  successMessage,
  onSuccessCallback,
  queryKeyToInvalidate,
}: DataMutationOptions<TResponse>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<TResponse, TError, TData>({
    mutationFn: (data: TData) => mutateData(apiPath, method, data),

    onSuccess: (responseData) => {
      toast.success(t(successMessage || "message.successful") + " 🎉");

      // Invalidate queries to trigger a re-fetch of stale data
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }

      // Execute the custom callback for component-specific logic (e.g., closing a modal)
      if (onSuccessCallback) {
        onSuccessCallback(responseData);
      }
    },

    onError: (error) => {
      let errorMessage = t("message.errorGeneric");

      if (axios.isAxiosError(error)) {
        // Attempt to get a specific error message from the API response
        const errorData = error.response?.data as { message?: string };
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
      }

      toast.error(errorMessage);
    },
  });
};

export default useMutationQuery;
