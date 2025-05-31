import { prisma } from "./prisma";

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
        images: true,
      },
    });

    return serializeData(beach);
  } catch (error) {
    console.error("Failed to fetch beach:", error);
    return null;
  }
}
