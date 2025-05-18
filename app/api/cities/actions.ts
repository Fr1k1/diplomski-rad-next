"use server";

import { getCitiesByCountry } from "@/lib/api";

export async function getCitiesByCountryAction(countryId: string) {
  try {
    const cities = await getCitiesByCountry(countryId);
    return { success: true, data: cities };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { success: false, error: String(error) };
  }
}
