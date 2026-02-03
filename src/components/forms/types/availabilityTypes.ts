import { OccasionalType, TimeSlot as SdkTimeSlot } from "need4deed-sdk";
import { Selected } from "./formTypes";

export type TimeSlotId = SdkTimeSlot | OccasionalType;

export type AvailabilitySlot = Omit<Selected, "id"> & { id: TimeSlotId };

export type Availability = Array<{
  weekday: number;
  timeSlots: AvailabilitySlot[];
}>;
