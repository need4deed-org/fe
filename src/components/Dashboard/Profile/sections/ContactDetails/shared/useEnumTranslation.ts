import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type EnumTranslation<T extends string> = {
  options: string[];
  toLabel: (key: T) => string;
  toKey: (label: string) => T;
  labelsToKeys: (labels: (string | number)[]) => T[];
  keysToLabels: (keys: T[]) => string[];
};

export function useEnumTranslation<T extends string>(
  enumValues: T[],
  translationPrefix: string,
): EnumTranslation<T> {
  const { t } = useTranslation();

  return useMemo(() => {
    const keyToLabel = new Map<T, string>();
    const labelToKey = new Map<string, T>();
    const options: string[] = [];

    enumValues.forEach((key) => {
      const label = t(`${translationPrefix}.${key}`);
      keyToLabel.set(key, label);
      labelToKey.set(label, key);
      options.push(label);
    });

    return {
      options,
      toLabel: (key: T) => keyToLabel.get(key) ?? key,
      toKey: (label: string) => labelToKey.get(label) ?? (label as T),
      labelsToKeys: (labels: (string | number)[]) =>
        labels.map((l) => labelToKey.get(String(l)) ?? (String(l) as T)),
      keysToLabels: (keys: T[]) => keys.map((k) => keyToLabel.get(k) ?? k),
    };
  }, [enumValues, translationPrefix, t]);
}
