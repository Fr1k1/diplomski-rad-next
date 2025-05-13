import { getBeachById } from "@/lib/api";
import BeachDetailsClient from "@/components/ui/BeachDetailsClient";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export default async function BeachDetailsPage({ params }) {
  const beach = await getBeachById(Number(params.id));

  const beachImages = await getBeachImages(Number(params.id));
  return <BeachDetailsClient beach={beach} beachImages={beachImages} />;
}

async function getBeachImages(beachId) {
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
  return urls.filter((url) => url !== null);
}
