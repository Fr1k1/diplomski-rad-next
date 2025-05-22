import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");

    if (!countryId) {
      return NextResponse.json(
        { error: "Country ID is required" },
        { status: 400 }
      );
    }

    let parsedId: number;
    try {
      parsedId = parseInt(countryId, 10);
      if (isNaN(parsedId)) {
        throw new Error(`Invalid country ID: ${countryId}`);
      }
    } catch (error) {
      console.error("Wrong countryId format:", countryId);
      return NextResponse.json(
        { error: "Invalid country ID format" },
        { status: 400 }
      );
    }

    const cities = await prisma.cities.findMany({
      where: {
        country_id: parsedId,
      },
      select: {
        id: true,
        name: true,
        country_id: true,
        latitude: true,
        longitude: true,
      },
    });

    const transformedCities = cities.map((city) => ({
      id: city.id,
      name: city.name,
      countryId: city.country_id,

      latitude: parseFloat(String(city.latitude)),
      longitude: parseFloat(String(city.longitude)),
    }));

    const validCities = transformedCities.filter(
      (city) => !isNaN(city.latitude) && !isNaN(city.longitude)
    );

    return NextResponse.json(validCities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
