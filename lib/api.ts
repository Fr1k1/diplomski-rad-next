import { City } from "@/app/types/City";
import { prisma } from "@/lib/prisma";

export async function getCitiesByCountry(countryId: string): Promise<City[]> {
  try {
    const cities = await prisma.cities.findMany({
      where: {
        country_id: parseInt(countryId, 10),
      },
      //sve se mora tu selectati da bude dostupno dolje
      select: {
        id: true,
        name: true,
        country_id: true,
        latitude: true,
        longitude: true,
      },
    });

    const typedCities: City[] = cities.map((city) => ({
      id: city.id,
      name: city.name,
      country_id: city.country_id,
      countryId: city.country_id,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    return typedCities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

export async function getBeachesByType(typeId: number, limit: number = 4) {
  try {
    const beaches = await prisma.beaches.findMany({
      where: {
        beach_type_id: typeId,
        approved: true,
      },
      take: limit,
      include: {
        cities: {
          include: {
            countries: {
              select: { name: true },
            },
          },
        },
        reviews: {
          select: {
            title: true,
            description: true,
            rating: true,
          },
        },
        images: {
          take: 1,
        },
      },
    });

    return beaches;
  } catch (error) {
    console.error("Error fetching beaches by type:", error);
    return [];
  }
}
