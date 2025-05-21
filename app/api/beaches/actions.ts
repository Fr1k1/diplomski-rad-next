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

export async function addBeach(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const beachTypeId = formData.get("beachTypeId") as string;
    const beachDepthId = formData.get("beachDepthId") as string;
    const beachTextureId = formData.get("beachTextureId") as string;
    const cityId = formData.get("cityId") as string;
    const working_hours = formData.get("working_hours") as string;
    const description = formData.get("description") as string;
    const best_time_to_visit = formData.get("best_time_to_visit") as string;
    const local_wildlife = formData.get("local_wildlife") as string;
    const restaurants_and_bars_nearby = formData.get(
      "restaurants_and_bars_nearby"
    ) as string;
    const characteristics = formData.getAll("characteristics") as string[];
    const featured_items = formData.getAll("featured_items") as string[];
    const userId = formData.get("userId") as string;

    const beach = await prisma.beaches.create({
      data: {
        name,
        address,
        beach_type_id: Number(beachTypeId),
        beach_depth_id: Number(beachDepthId),
        beach_texture_id: Number(beachTextureId),
        city_id: Number(cityId),
        working_hours,
        description,
        best_time_to_visit,
        local_wildlife,
        restaurants_and_bars_nearby,
        user_id: userId,
        approved: false,
      },
    });

    if (characteristics.length > 0) {
      await Promise.all(
        characteristics.map((charId) =>
          prisma.beach_has_characteristics.create({
            data: {
              featured: false,
              beaches: {
                connect: { id: beach.id },
              },
              characteristics: {
                connect: { id: Number(charId) },
              },
            },
          })
        )
      );
    }

    if (featured_items.length > 0) {
      await Promise.all(
        featured_items.map((itemId) =>
          prisma.beach_has_characteristics.create({
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

    const filePromises = [];

    for (let i = 0; i < 10; i++) {
      const fileKey = `picture-${i}`;
      const file = formData.get(fileKey) as File;

      if (file && file instanceof File && file.size > 0) {
        filePromises.push(uploadImages(beach.id, file));
      }
    }

    if (filePromises.length > 0) {
      await Promise.all(filePromises);
    }
    return { success: true, data: beach };
  } catch (error) {
    console.error("Error adding beach:", error);
    return { success: false, error: "Failed to add beach" };
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

    console.log("U actionu karakteristike su", characteristics);
    console.log("U actionu, featured items su", featured_items);

    const formDataWithArrays = {
      ...rawFormData,
      characteristics,
      featured_items,
      approved: true,
    };

    const validatedData = confirmBeachFormSchema.safeParse(formDataWithArrays);

    console.log("Validated data je", validatedData);

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

    console.log("Sve karakteristike su", allCharacteristics);

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

    const filePromises = [];

    for (let i = 0; i < 10; i++) {
      const fileKey = `picture-${i}`;
      const file = formData.get(fileKey) as File;

      if (file && file instanceof File && file.size > 0) {
        filePromises.push(uploadImages(beachId, file));
      }
    }

    if (filePromises.length > 0) {
      await Promise.all(filePromises);
    }

    revalidatePath("/beaches");
    revalidatePath(`/beach/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Error confirming beach:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getFilteredBeachesAction(
  countryId: string,
  filters: {
    cityId?: string;
    waterTypeId?: string;
    beachTextureId?: string;
    characteristicIds?: number[];
  }
): Promise<FilteredBeaches[]> {
  const { cityId, waterTypeId, beachTextureId, characteristicIds } = filters;

  try {
    const whereClause: any = {
      cities: {
        country_id: parseInt(countryId),
      },
      approved: true,
    };

    if (cityId) {
      whereClause.city_id = parseInt(cityId);
    }

    if (waterTypeId) {
      whereClause.beach_type_id = parseInt(waterTypeId);
    }

    if (beachTextureId) {
      whereClause.beach_texture_id = parseInt(beachTextureId);
    }

    let beaches = await prisma.beaches.findMany({
      where: whereClause,
      include: {
        beach_types: true,
        beach_textures: true,
        cities: {
          include: {
            countries: true,
          },
        },
        images: {
          take: 1,
        },
        beach_has_characteristics: {
          include: {
            characteristics: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (characteristicIds && characteristicIds.length > 0) {
      beaches = beaches.filter((beach) => {
        const beachCharIds = beach.beach_has_characteristics.map(
          (char) => char.characteristic_id
        );
        return characteristicIds.every((id) => beachCharIds.includes(id));
      });
    }

    const transformedBeaches: FilteredBeaches[] = beaches.map((beach) => ({
      id: beach.id,
      name: beach.name,
      description: beach.description,
      address: beach.address,
      beachType: beach.beach_types.name,
      beachTexture: beach.beach_textures.name,
      cityName: beach.cities.name,
      countryName: beach.cities.countries.name,
      imagePath: beach.images[0]?.path || null,
      reviewCount: beach._count.reviews,
    }));

    return transformedBeaches;
  } catch (error) {
    console.error("Error in getFilteredBeachesAction:", error);
    throw new Error("Failed to fetch filtered beaches");
  }
}
