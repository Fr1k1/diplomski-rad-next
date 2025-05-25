import { Prisma } from "@prisma/client";

export type City = {
  id: string | number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  countryId: number;
  country_id?: number;
};
