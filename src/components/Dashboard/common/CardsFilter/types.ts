import { Dispatch, SetStateAction } from "react";

export type SetFilter<TFilter> = Dispatch<SetStateAction<TFilter>>;

export type SelectionMap = Record<string, boolean>;

export type FilterItem = {
  label: string;
  checked: unknown;
  onChange: (checked: boolean) => void;
};
