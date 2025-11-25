import { Dispatch, SetStateAction } from "react";

export type SetFilter<TFilter> = Dispatch<SetStateAction<TFilter>>;

export type SelectionMap = Record<string, boolean>;
