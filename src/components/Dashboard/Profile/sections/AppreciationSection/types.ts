import { VolunteerStateAppreciationType } from "need4deed-sdk";

export type ApiAppreciationGet = {
  id: number;
  title: VolunteerStateAppreciationType;
  dateDue?: Date;
  dateDelivery?: Date;
  volunteerId: number;
  opportunityId?: number;
  userId?: number;
};

export type ApiAppreciationPost = {
  title: VolunteerStateAppreciationType;
  dateDue: Date;
  dateDelivery?: Date;
};

export type ApiAppreciationPatch = {
  title?: VolunteerStateAppreciationType;
  dateDue?: Date | null;
  dateDelivery?: Date | null;
};
