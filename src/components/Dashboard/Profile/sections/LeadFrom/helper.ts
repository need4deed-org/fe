import { OptionItem } from "need4deed-sdk";

export function resolveLeadFromTitles(leadFrom: OptionItem[] | undefined, options: OptionItem[]): string[] {
  if (!leadFrom || leadFrom.length === 0) return [];

  const titleById = new Map<number, string>();
  for (const option of options) {
    titleById.set(option.id, option.title);
  }

  const seen = new Set<string>();
  const titles: string[] = [];

  for (const item of leadFrom) {
    const title = (titleById.get(item.id) ?? item.title)?.trim();
    if (!title || seen.has(title)) continue;
    seen.add(title);
    titles.push(title);
  }

  return titles;
}
