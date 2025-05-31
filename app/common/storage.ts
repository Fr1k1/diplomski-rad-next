import { createClient as createClientServer } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getSignedImageUrlServer(path: string) {
  const supabase = createClientServer();
  const { data, error } = await supabase.storage
    .from("beach_images")
    .createSignedUrl(path, 7200);

  if (error) {
    console.error("Error creating URL:", error);
    return null;
  }

  return data.signedUrl;
}

export async function getBeachImagesServer(beachId: string) {
  const beach = await prisma.beaches.findUnique({
    where: { id: Number(beachId) },
    include: {
      images: {
        select: { path: true },
      },
    },
  });

  const beachImages = beach?.images || [];

  const imageUrlPromises = beachImages.map(async (image) => {
    return getSignedImageUrlServer(image.path);
  });

  const urls = await Promise.all(imageUrlPromises);
  return urls.filter((url) => url !== null) as string[];
}
