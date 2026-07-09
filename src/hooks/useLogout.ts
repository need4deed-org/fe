import { apiPathAuthLogout } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { clearAuthHint } from "@/utils/helpers";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutationQuery<void, unknown>({
    apiPath: apiPathAuthLogout,
    method: "post",
    onSuccessCallback: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      clearAuthHint();
      window.location.href = "/login";
    },
  });
};
