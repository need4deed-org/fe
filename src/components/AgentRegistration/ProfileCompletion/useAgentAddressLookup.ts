import { apiPathAgentRegister, cacheTTL } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetQuery } from "@/hooks";
import { useState } from "react";

type AgentSearchMatch = { id: number; title: string };

// Powers the self-registration picker: as the user types their street, look up
// existing agents at a matching address so they can JOIN their org instead of
// creating a duplicate. Backed by the token-gated GET /agent/register/search
// (the COORDINATOR-only GET /agent is not available to a registrant).
export function useAgentAddressLookup(
  addressStreet: string,
  addressPostcode: string,
  token: string | null,
  onConfirm?: (matched: AgentSearchMatch) => void,
) {
  const [selectedAgent, setSelectedAgent] = useState<AgentSearchMatch | null>(null);
  const [dismissedAddress, setDismissedAddress] = useState<string | null>(null);
  const debouncedAddress = useDebounce(addressStreet.trim(), 400);
  const debouncedPostcode = useDebounce(addressPostcode.trim(), 400);

  const enabled = debouncedAddress.length >= 3 && !!debouncedPostcode && !!token;

  const { data } = useGetQuery<AgentSearchMatch[]>({
    queryKey: ["agent-register-search", debouncedAddress, debouncedPostcode],
    apiPath: `${apiPathAgentRegister}/search?token=${encodeURIComponent(
      token ?? "",
    )}&street=${encodeURIComponent(debouncedAddress)}&postcode=${encodeURIComponent(debouncedPostcode)}`,
    staleTime: cacheTTL,
    enabled,
    addLang: false,
  });

  // The API returns the decisive match (exact/legacy) first, followed by any
  // other street-prefix candidates — but callers should not assume a single
  // "the" match anymore, since more than one org can share a partial address.
  const matches = enabled ? (data ?? []) : [];

  const isDismissed = dismissedAddress === debouncedAddress;
  const isMatch = !!selectedAgent && matches.some((m) => m.id === selectedAgent.id);
  const showBanner = matches.length > 0 && !isMatch && !isDismissed;

  const selectMatch = (agent: AgentSearchMatch) => {
    setSelectedAgent(agent);
    onConfirm?.(agent);
  };

  const dismissMatch = () => {
    setDismissedAddress(debouncedAddress);
    setSelectedAgent(null);
  };

  return {
    matches,
    selectedAgent,
    isMatch,
    showBanner,
    selectMatch,
    dismissMatch,
  };
}
