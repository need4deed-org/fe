import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { LoadingErrorWrapper } from "./LoadingErrorWrapper";
import ProfilePage from "./ProfilePage";
import { ApiAgentProfileGet } from "./types";

type Props = {
  entityId: string;
};

export const AgentProfileController = ({ entityId }: Props) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiAgentProfileGet>({
    queryKey: ["agent", entityId],
    apiPath: `${apiPathAgent}/${entityId}`,
    staleTime: cacheTTL,
  });

  return (
    <LoadingErrorWrapper isLoading={isLoading} isError={isError} error={error} data={data} entityType="agent">
      {data && <ProfilePage agent={data} />}
    </LoadingErrorWrapper>
  );
};
