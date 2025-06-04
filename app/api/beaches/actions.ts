"use server";

import { FilteredBeaches } from "@/app/common/types";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  rating: z.number().min(1, { message: "Rating is required." }),
  userId: z.string().min(1, { message: "User id must not be null." }),
  beachId: z.string().min(1, { message: "Beach id must not be null." }),
});

export async function addReview(prevState: any, formData: FormData) {
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    rating: Number(formData.get("rating")),
    userId: formData.get("userId") as string,
    beachId: formData.get("beachId") as string,
  };

  const validationResult = reviewSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const newReview = await prisma.reviews.create({
      data: {
        title: validationResult.data.title,
        description: validationResult.data.description,
        rating: validationResult.data.rating,
        user_id: validationResult.data.userId,
        beach_id: parseInt(validationResult.data.beachId),
      },
    });

    revalidatePath(`/beaches/${rawData.beachId}`);

    return {
      success: true,
      data: newReview,
    };
  } catch (error) {
    console.error("Error adding review:", error);
    let errorMessage = "An error occurred while adding the review";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getBeachGeoDataById(id: string) {
  try {
    const beachId = parseInt(id);

    const beach = await prisma.beaches.findUnique({
      where: {
        id: beachId,
      },
      select: {
        id: true,
        name: true,
        cities: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
            countries: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!beach) {
      return null;
    }

    return {
      id: beach.id,
      name: beach.name,
      city: {
        name: beach.cities.name,
        latitude: beach.cities.latitude ? Number(beach.cities.latitude) : null,
        longitude: beach.cities.longitude
          ? Number(beach.cities.longitude)
          : null,
        country: {
          id: beach.cities.countries.id,
          name: beach.cities.countries.name,
        },
      },
    };
  } catch (error) {
    console.error("Failed to fetch beach geo data:", error);
    return null;
  }
}

const addBeachFormSchema = z.object({
  name: z.string().min(2).max(80),
  address: z.string().min(2),
  beachTypeId: z.string().min(1),
  beachDepthId: z.string().min(1),
  beachTextureId: z.string().min(1),
  cityId: z.string().min(1),
  working_hours: z.string().min(2).max(80),
  description: z.string().min(2),
  best_time_to_visit: z.string().min(2).max(100),
  local_wildlife: z.string().min(2),
  restaurants_and_bars_nearby: z.string().min(2),
  characteristics: z.array(z.number()).optional(),
  featured_items: z.array(z.string()).optional().default([]),
  userId: z.string().min(1),
});

async function processBeachImages(
  beachId: number,
  formData: FormData
): Promise<void> {
  const filePromises = [];

  const MAX_NUMBER_OF_IMAGES = 5;

  for (let i = 0; i < MAX_NUMBER_OF_IMAGES; i++) {
    const fileKey = `picture-${i}`;
    const file = formData.get(fileKey) as File;

    if (file && file instanceof File && file.size > 0) {
      filePromises.push(uploadImages(beachId, file));
    }
  }

  if (filePromises.length > 0) {
    await Promise.all(filePromises);
  }
}

export async function addBeach(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    beachTypeId: formData.get("beachTypeId") as string,
    beachDepthId: formData.get("beachDepthId") as string,
    beachTextureId: formData.get("beachTextureId") as string,
    cityId: formData.get("cityId") as string,
    working_hours: formData.get("working_hours") as string,
    description: formData.get("description") as string,
    best_time_to_visit: formData.get("best_time_to_visit") as string,
    local_wildlife: formData.get("local_wildlife") as string,
    restaurants_and_bars_nearby: formData.get(
      "restaurants_and_bars_nearby"
    ) as string,
    characteristics: formData.getAll("characteristics").map(Number),
    featured_items: formData.getAll("featured_items") as string[],
    userId: formData.get("userId") as string,
  };

  const validationResult = addBeachFormSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const beach = await tx.beaches.create({
        data: {
          name: validationResult.data.name,
          address: validationResult.data.address,
          beach_type_id: Number(validationResult.data.beachTypeId),
          beach_depth_id: Number(validationResult.data.beachDepthId),
          beach_texture_id: Number(validationResult.data.beachTextureId),
          city_id: Number(validationResult.data.cityId),
          working_hours: validationResult.data.working_hours,
          description: validationResult.data.description,
          best_time_to_visit: validationResult.data.best_time_to_visit,
          local_wildlife: validationResult.data.local_wildlife,
          restaurants_and_bars_nearby:
            validationResult.data.restaurants_and_bars_nearby,
          user_id: validationResult.data.userId,
          approved: false,
        },
      });

      if (
        validationResult.data.characteristics &&
        validationResult.data.characteristics.length > 0
      ) {
        await Promise.all(
          validationResult.data.characteristics.map((charId) =>
            tx.beach_has_characteristics.create({
              data: {
                featured: false,
                beaches: {
                  connect: { id: beach.id },
                },
                characteristics: {
                  connect: { id: charId },
                },
              },
            })
          )
        );
      }

      if (
        validationResult.data.featured_items &&
        validationResult.data.featured_items.length > 0
      ) {
        await Promise.all(
          validationResult.data.featured_items.map((itemId) =>
            tx.beach_has_characteristics.create({
              data: {
                featured: true,
                beaches: {
                  connect: { id: beach.id },
                },
                characteristics: {
                  connect: { id: Number(itemId) },
                },
              },
            })
          )
        );
      }

      return beach;
    });

    try {
      await processBeachImages(result.id, formData);
    } catch (imageError) {
      console.error("Error processing images:", imageError);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding beach:", error);
    let errorMessage = "Failed to add beach";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function uploadImages(beachId: number, filesInput: File | File[]) {
  const supabase = createClient();
  try {
    const uploadedImageIds: string[] = [];

    const files = Array.isArray(filesInput) ? filesInput : [filesInput];

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from("beach_images")
        .upload(`beaches/${beachId}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }

      const { error: insertError } = await supabase.from("images").insert({
        beach_id: beachId,
        path: data?.path,
      });

      if (insertError) {
        console.error("Error inserting image record:", insertError);
      } else {
        uploadedImageIds.push(data?.path);
      }
    }

    return { success: true, imageIds: uploadedImageIds };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { success: false, error: "Failed to upload images" };
  }
}

const confirmBeachFormSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(2),
  beachTypeId: z.string().min(1),
  beachDepthId: z.string().min(1),
  beachTextureId: z.string().min(1),
  cityId: z.string().min(1),
  working_hours: z.string().min(2),
  description: z.string().min(2),
  best_time_to_visit: z.string().min(2),
  local_wildlife: z.string().min(2),
  restaurants_and_bars_nearby: z.string().min(2),
  characteristics: z.array(z.number()).optional(),
  featured_items: z.array(z.string().optional()).default([]),
  approved: z.boolean().optional(),
  userId: z.string().min(1),
  images: z.array(z.string()).optional(),
});

export async function confirmBeach(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { success: false, error: "Beach ID is required" };
    }

    const rawFormData = Object.fromEntries(formData.entries());

    const characteristics = formData.getAll("characteristics").map(Number);
    const featured_items = formData
      .getAll("featured_items")
      .filter(Boolean) as string[];

    const formDataWithArrays = {
      ...rawFormData,
      characteristics,
      featured_items,
      approved: true,
    };

    const validatedData = confirmBeachFormSchema.safeParse(formDataWithArrays);

    if (!validatedData.success) {
      return {
        success: false,
        error: "Validation error",
        issues: validatedData.error.issues,
      };
    }

    const beachId = parseInt(id);

    const allCharacteristics = [
      ...characteristics.map((charId) => ({
        beach_id: beachId,
        characteristic_id: charId,
        featured: false,
      })),
      ...featured_items.map((charId) => ({
        beach_id: beachId,
        characteristic_id: parseInt(charId),
        featured: true,
      })),
    ];

    const result = await prisma.$transaction(async (tx) => {
      const updatedBeach = await tx.beaches.update({
        where: {
          id: beachId,
        },
        data: {
          name: validatedData.data.name,
          address: validatedData.data.address,
          beach_type_id: parseInt(validatedData.data.beachTypeId),
          beach_depth_id: parseInt(validatedData.data.beachDepthId),
          beach_texture_id: parseInt(validatedData.data.beachTextureId),
          city_id: parseInt(validatedData.data.cityId),
          working_hours: validatedData.data.working_hours,
          description: validatedData.data.description,
          best_time_to_visit: validatedData.data.best_time_to_visit,
          local_wildlife: validatedData.data.local_wildlife,
          restaurants_and_bars_nearby:
            validatedData.data.restaurants_and_bars_nearby,
          approved: true,
          user_id: validatedData.data.userId,
        },
      });

      await tx.beach_has_characteristics.deleteMany({
        where: {
          beach_id: beachId,
        },
      });
      for (const entry of allCharacteristics) {
        try {
          await tx.beach_has_characteristics.create({
            data: {
              beach_id: entry.beach_id,
              characteristic_id: entry.characteristic_id,
              featured: entry.featured,
            },
          });
        } catch (error) {
          console.error(
            `Error inserting entry: ${JSON.stringify(entry)}`,
            error
          );
          throw error;
        }
      }

      return updatedBeach;
    });

    try {
      await processBeachImages(beachId, formData);
    } catch (imageError) {
      console.error("Error processing images:", imageError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error confirming beach:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getFilteredBeachesAction(
  filters: {
    cityId?: string;
    waterTypeId?: string;
    beachTextureId?: string;
    characteristicIds?: number[];
  },
  page = 1,
  pageSize = 9,
  countryId?: string
): Promise<{
  data: FilteredBeaches[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}> {
  const { cityId, waterTypeId, beachTextureId, characteristicIds } = filters;
  const offset = (page - 1) * pageSize;

  try {
    const whereClause: any = {
      approved: true,
    };

    if (countryId) {
      whereClause.cities = {
        country_id: parseInt(countryId),
      };
    }

    if (cityId) {
      whereClause.city_id = parseInt(cityId);
    }

    if (waterTypeId) {
      whereClause.beach_type_id = parseInt(waterTypeId);
    }

    if (beachTextureId) {
      whereClause.beach_texture_id = parseInt(beachTextureId);
    }

    if (characteristicIds && characteristicIds.length > 0) {
      whereClause.beach_has_characteristics = {
        some: {
          characteristic_id: {
            in: characteristicIds,
          },
        },
      };
    }

    const totalCount = await prisma.beaches.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    let beaches = await prisma.beaches.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      include: {
        images: {
          take: 1,
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    const transformedBeaches: FilteredBeaches[] = beaches.map((beach) => {
      let avgRating = 0;
      if (beach.reviews && beach.reviews.length > 0) {
        const totalRating = beach.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        avgRating = totalRating / beach.reviews.length;
      }

      return {
        id: beach.id,
        name: beach.name,
        description: beach.description,
        address: beach.address,
        imagePath: beach.images[0]?.path || null,
        reviewCount: beach._count.reviews,
        avgRating: avgRating,
      };
    });

    return {
      data: transformedBeaches,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error("Error in getFilteredBeachesAction:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalCount: 0,
    };
  }
}

export async function getBeachRequests(page = 1, pageSize = 12) {
  try {
    const whereClause = { approved: false };
    const offset = (page - 1) * pageSize;

    const totalCount = await prisma.beaches.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const beaches = await prisma.beaches.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      include: {
        beach_textures: {
          select: {
            name: true,
            img_url: true,
          },
        },
        beach_types: {
          select: {
            name: true,
          },
        },
        beach_depths: {
          select: {
            description: true,
          },
        },
        cities: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
            countries: {
              select: {
                name: true,
              },
            },
          },
        },
        users: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        reviews: {
          select: {
            title: true,
            description: true,
            rating: true,
            users: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    const serializedBeaches = beaches.map((beach) => ({
      ...beach,
      cities: beach.cities
        ? {
            ...beach.cities,
            latitude: parseFloat(beach.cities.latitude.toString()),
            longitude: parseFloat(beach.cities.longitude.toString()),
          }
        : beach.cities,
    }));

    return {
      beaches: serializedBeaches,
      pagination: {
        page,
        pageSize,
        total: totalCount,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching beach requests:", error);
    return {
      beaches: [],
      pagination: { page, pageSize, total: 0, totalPages: 0 },
    };
  }
}
