import { ApiLanguageOption } from "./hooks";

export type BiDirectionalMapping = {
  idToLabel: Record<string | number, string>;
  labelToId: Record<string, string | number>;
};

export function createBiDirectionalMapping(items: ApiLanguageOption[]): BiDirectionalMapping {
  const idToLabel: Record<string | number, string> = {};
  const labelToId: Record<string, string | number> = {};

  items.forEach((item) => {
    idToLabel[item.id] = item.title;
    labelToId[item.title] = item.id;
  });

  return { idToLabel, labelToId };
}

export function createTitleToIdMap(items: ApiLanguageOption[]): Record<string, number> {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    map[item.title.toLowerCase()] = item.id;
  });
  return map;
}

export function createIdToTitleMap(items: ApiLanguageOption[]): Record<number, string> {
  const map: Record<number, string> = {};
  items.forEach((item) => {
    map[item.id] = item.title;
  });
  return map;
}
