"use server";

import { prisma } from "@/lib/prisma";
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
