import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// A generic function to fetch paginated data
const fetchData = async <T,>(apiPath: string, page: number, limit: number): Promise<T[]> => {
  const url = `${apiPath}?page=${page}&limit=${limit}`;
  const response: AxiosResponse<ApiResponse<T>> = await axios.get(url);
  return response.data.data;
};

interface ApiResponse<T> {
  message: string;
  data: T[];
}

// The generic custom hook with pagination query params
export const useGetQuery = <T,>(queryKey: string[], apiPath: string, options?: { page?: number; limit?: number }) => {
  const { t } = useTranslation();

  const { page = 1, limit = 10 } = options || {};

  const { data, isLoading, isError, error } = useQuery<T[], Error>({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () => fetchData<T>(apiPath, page, limit),
  });

  // Display a toast message when an error occurs
  useEffect(() => {
    if (isError) {
      let errorMessage = t("message.errorGeneric");

      if (error && axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        errorMessage = errorData?.message || errorData;
      } else if (error) {
        // Fallback for non-Axios errors
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  }, [isError, error, t]);

  return { data: data || [], isLoading, isError, error };
};
