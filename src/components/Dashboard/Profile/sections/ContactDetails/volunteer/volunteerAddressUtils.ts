import { ApiVolunteerGet } from "need4deed-sdk";

export const formatAddress = (address: ApiVolunteerGet["person"]["address"]) => {
  if (!address || typeof address !== "object") return "";

  const postcode = address.postcode && typeof address.postcode === "object" ? address.postcode.code : address.postcode;
  return [address.street, address.city, postcode].filter(Boolean).join(", ");
};

export const parseAddress = (addressString: string) => {
  const [street = "", city = "", postcode = ""] = addressString.split(",").map((part) => part.trim());
  return { street, city, postcode };
};
