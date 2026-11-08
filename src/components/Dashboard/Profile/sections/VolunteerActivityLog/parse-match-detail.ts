import { OpportunityVolunteerStatusType } from "need4deed-sdk";

export type MatchDetail =
  | { kind: "linked"; title: string; status?: OpportunityVolunteerStatusType; imported: boolean }
  | { kind: "removed"; title: string; from: OpportunityVolunteerStatusType }
  | {
      kind: "statusChanged";
      title: string;
      from?: OpportunityVolunteerStatusType;
      to: OpportunityVolunteerStatusType;
    };

const LINKED = /^Linked to opportunity "(.*)"(?: as (\S+))?( \(imported\))?\.$/;
const REMOVED = /^Removed from opportunity "(.*)" \(was (\S+)\)\.$/;
const STATUS_CHANGED = /^Opportunity "(.*)" status changed(?: from (\S+))? to (\S+)\.$/;

const statuses: string[] = Object.values(OpportunityVolunteerStatusType);

const isStatus = (value: string): value is OpportunityVolunteerStatusType => statuses.includes(value);

const isOptionalStatus = (value: string | undefined): value is OpportunityVolunteerStatusType | undefined =>
  value === undefined || isStatus(value);

export function parseMatchDetail(detail: string): MatchDetail | null {
  const linked = LINKED.exec(detail);
  if (linked) {
    const [, title, status, imported] = linked;
    return isOptionalStatus(status) ? { kind: "linked", title, status, imported: Boolean(imported) } : null;
  }

  const removed = REMOVED.exec(detail);
  if (removed) {
    const [, title, from] = removed;
    return isStatus(from) ? { kind: "removed", title, from } : null;
  }

  const statusChanged = STATUS_CHANGED.exec(detail);
  if (statusChanged) {
    const [, title, from, to] = statusChanged;
    return isOptionalStatus(from) && isStatus(to) ? { kind: "statusChanged", title, from, to } : null;
  }

  return null;
}
