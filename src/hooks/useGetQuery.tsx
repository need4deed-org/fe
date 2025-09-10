import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

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
  const { page = 1, limit = 10 } = options || {};

  const { data, isLoading, isError, error } = useQuery<T[], Error>({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () => fetchData<T>(apiPath, page, limit),
  });

  return { data: data || [], isLoading, isError, error };
};
