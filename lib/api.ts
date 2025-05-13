import { City } from "@/app/types/City";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

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

function serializeData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "bigint") {
    return Number(data);
  }

  if (typeof data === "object") {
    if (data.constructor && data.constructor.name === "Decimal") {
      return Number(data);
    }
    if (data instanceof Date) {
      return data.toISOString();
    }

    if (Array.isArray(data)) {
      return data.map((item) => serializeData(item));
    }
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (typeof data[key] !== "function") {
          result[key] = serializeData(data[key]);
        }
      }
    }
    return result;
  }
  return data;
}

export async function getBeachById(id: number) {
  try {
    const beach = await prisma.beaches.findUnique({
      where: { id: Number(id) },
      include: {
        beach_textures: {
          select: { name: true, img_url: true },
        },
        beach_types: {
          select: { name: true },
        },
        beach_depths: {
          select: { description: true },
        },
        cities: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
            countries: {
              select: { id: true, name: true },
            },
          },
        },
        users: {
          select: { first_name: true, last_name: true },
        },
        reviews: {
          select: {
            title: true,
            description: true,
            rating: true,
            users: {
              select: { first_name: true, last_name: true },
            },
          },
        },
        beach_has_characteristics: {
          include: {
            characteristics: {
              select: { id: true, name: true, icon_url: true },
            },
          },
        },
      },
    });
    const imageUrls = [];
    if (beach?.images && beach.images.length > 0) {
      const supabase = createClient();

      for (const image of beach.images) {
        try {
          const { data, error } = await supabase.storage
            .from("beach_images")
            .createSignedUrl(image.path, 7200);

          if (!error && data) {
            imageUrls.push(data.signedUrl);
          }
        } catch (e) {
          console.error("Error creating signed URL:", e);
        }
      }
    }

    const beachWithImages = {
      ...serializeData(beach),
      imageUrls,
    };

    return beachWithImages;
  } catch (error) {
    console.error("Failed to fetch beach:", error);
    return null;
  }
}
