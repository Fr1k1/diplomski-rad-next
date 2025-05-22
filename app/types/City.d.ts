import { Prisma } from "@prisma/client";

export type City = {
  id: string | number;
  name: string;
  latitude: Prisma.decimal;
  longitude: Prisma.decimal;
  countryId: number;
  country_id?: number;
};
