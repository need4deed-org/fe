import { cloudfrontURL } from "@/config/constants";
import { Lang } from "need4deed-sdk";

export function isEnumValue<E>(enumObject: object, value: E) {
  return typeof enumObject === "object" ? Object.values(enumObject).includes(value) : false;
}

export const getImageUrl = (imageName: string): string => {
  return `${cloudfrontURL}/${imageName}`;
};

export function capitalizeFirstLetter(str: string): string {
  if (!str) {
    return "";
  }
  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1);
  return firstLetter + restOfString;
}
