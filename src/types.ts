export interface PropsWithToken {
  token?: string | null;
}

export type RouteParams<T extends string = string> = {
  params: Promise<{ id: T }>;
};

export type VolunteerIdProps = {
  volunteerId: string;
};

export enum Env {
  DEVELOPMENT = "development",
  TEST = "test",
  PRODUCTION = "production",
}

export enum Language {
  DE = "de",
  EN = "en",
}

export enum LanguageLevel {
  NATIVE = "native",
  FLUENT = "fluent",
  INTERMEDIATE = "intermediate",
}

export type LanguageObject = {
  id: number;
  language: string;
  level: LanguageLevel | "";
  purpose?: import("need4deed-sdk").LangPurpose;
};

export type HttpMethod = "post" | "patch" | "put" | "delete";

export type IsEditing = { $isEditing: boolean };

export type HasError = { $hasError?: boolean };

export type HasHint = { $hasHint?: boolean };
