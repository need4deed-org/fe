import { apiPathPerson, apiPathUser, MAX_PAGE_LIMIT, USER_QUERY_KEY } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import axios from "axios";
import { ApiPersonGet, ApiPersonPatch, ApiUserGet, SortOrder, UserRole } from "need4deed-sdk";

const accountsQueryKey = ["admin-accounts"];

export const useAdminAccounts = (role: UserRole, search: string) => {
  const {
    data: accounts = [],
    isLoading,
    isError,
  } = useGetQuery<ApiUserGet[]>({
    queryKey: [...accountsQueryKey, role, search],
    apiPath: apiPathUser,
    params: {
      role,
      sortOrder: SortOrder.NewToOld,
      limit: MAX_PAGE_LIMIT,
      ...(search ? { search } : {}),
    },
    keepPreviousData: true,
  });

  return { accounts, isLoading, isError, isTruncated: accounts.length >= MAX_PAGE_LIMIT };
};

export const useAccountPerson = (personId: number) => {
  const { data, isLoading, isError } = useGetQuery<ApiPersonGet[]>({
    queryKey: ["person", String(personId)],
    apiPath: `${apiPathPerson}${personId}`,
  });

  return { person: data?.[0], isLoading, isError };
};

type RenameInput = { personId: number; name: Pick<ApiPersonPatch, "firstName" | "lastName"> };

export const useRenameAccount = () => {
  const { mutate: renameAccount, isPending: isRenaming } = useMutationQuery<RenameInput, unknown>({
    mutationFn: ({ personId, name }) => axios.patch(`${apiPathPerson}${personId}`, name).then((res) => res.data),
    successMessage: "dashboard.admin.accounts.renamed",
    queryKeyToInvalidate: [accountsQueryKey, ["person"], ["users"], USER_QUERY_KEY],
  });

  return { renameAccount, isRenaming };
};
