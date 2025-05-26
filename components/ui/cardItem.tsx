import { prisma } from "@/lib/prisma";
import CardItemClient from "./cardItemClient";
import { getSignedImageUrlServer } from "@/app/common/storage";
import { calculateAverageRating } from "@/app/common/utils";

type CardItemProps = {
  data: {
    id: number;
    name: string;
    image?: string;
    avgRating?: number;
    reviews?: any[];
    cities?: {
      name: string;
      countries?: {
        name: string;
      };
    };
  };
};

async function CardItem({ data }: CardItemProps) {
  let imageUrl = data.image;

  if (!imageUrl) {
    const beachImages = await prisma.images.findMany({
      where: {
        beach_id: data.id,
      },
      take: 1,
    });

    if (beachImages && beachImages.length > 0) {
      const signedUrl = await getSignedImageUrlServer(beachImages[0].path);
      if (signedUrl) {
        imageUrl = signedUrl;
      }
    }
  }

  if (!imageUrl) {
    imageUrl = "/no__image_placeholder.png";
  }

  const rating =
    data.avgRating !== undefined
      ? data.avgRating
      : data.reviews
      ? calculateAverageRating(data.reviews)
      : 0;

  return (
    <CardItemClient
      id={data.id}
      name={data.name}
      image={imageUrl}
      rating={rating}
      cityName={data?.cities?.name}
      countryName={data?.cities?.countries?.name}
    />
  );
}

export default CardItem;
