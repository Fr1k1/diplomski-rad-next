import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import CarouselClient from "./carouselClient";

export default async function CarouselServer({ beachId }: { beachId: string }) {
  const beach = await prisma.beaches.findUnique({
    where: { id: Number(beachId) },
    include: {
      images: {
        select: { path: true },
      },
    },
  });

  const beachImages = beach?.images || [];

  const supabase = createClient();
  const imageUrlPromises = beachImages.map(async (image) => {
    const { data, error } = await supabase.storage
      .from("beach_images")
      .createSignedUrl(image.path, 7200);

    if (error) {
      console.error("Error creating URL:", error);
      return null;
    }

    return data.signedUrl;
  });

  const urls = await Promise.all(imageUrlPromises);
  const validUrls = urls.filter((url) => url !== null) as string[];

  return <CarouselClient imageUrls={validUrls} />;
}
