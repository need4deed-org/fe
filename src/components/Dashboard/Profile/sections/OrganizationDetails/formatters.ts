import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { ApiAddress, Lang, OptionById, Service, Voidable } from "need4deed-sdk";

export function formatOrganizationAddress(address: Voidable<ApiAddress>): string {
  if (!address) return "";
  const cityLine = [address.postcode?.code, address.city].filter(Boolean).join(" ");
  return [address.street, cityLine].filter(Boolean).join(", ");
}

export function getOrganizationServiceTitles(
  services: Service[] | undefined,
  lang: Lang,
  fallbackById?: Record<number, string>,
): string[] {
  return (services ?? [])
    .map(
      (service) =>
        service.title?.[lang] ??
        service.title?.[Lang.DE] ??
        service.title?.[Lang.EN] ??
        (service.id != null ? fallbackById?.[Number(service.id)] : undefined),
    )
    .filter((title): title is string => Boolean(title));
}

export function getOrganizationAgentDistrictLabel(district: OptionById | null | undefined, lang: Lang): string {
  return district?.title?.[lang] ?? district?.title?.[Lang.DE] ?? district?.title?.[Lang.EN] ?? EMPTY_PLACEHOLDER_VALUE;
}
