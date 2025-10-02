import { ByDay, OccasionalType } from "need4deed-sdk";
import { TimeSlot } from "./constants";

export interface VolunteerCardsFilter {
  search: string;
  accompanying: boolean;
  engagement: Engagement;
  availability: Availability;
  district: Record<string, boolean>;
}

interface Engagement {
  new: boolean;
  active: boolean;
  temporarilyInactive: boolean;
  inactive: boolean;
}

interface Availability {
  times: Record<TimeSlot, boolean>;
  days: Record<ByDay, boolean>;
  occasional: Record<OccasionalType, boolean>;
}
