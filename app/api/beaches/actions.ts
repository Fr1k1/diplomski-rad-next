"use server";

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
