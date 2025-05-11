import { createClient } from "@/utils/supabase/server";
import { Image, Review } from "./types";

const supabase = createClient();

export const calculateAverageRating = (data: Array<Review>) => {
  if (data && data?.length > 0) {
    const totalRating = data.reduce(
      (sum: number, review: Review) => sum + review.rating,
      0
    );
    return totalRating / data.length;
  }
  return 0;
};

// export const fetchBeachImages = async (
//   id: number,
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>,
//   setImageUrls: React.Dispatch<React.SetStateAction<string[]>>
// ) => {
//   try {
//     setLoading(true);
//     const beachImages = await getBeachImages(id);
//     if (beachImages && beachImages.length > 0) {
//       const signedUrlPromises = beachImages.map(async (image: Image) => {
//         const { data, error } = await supabase.storage
//           .from("beach_images")
//           .createSignedUrl(image.path, 7200);

//         if (error) {
//           console.error("Error creating URL:", error);
//           return null;
//         }

//         return data.signedUrl;
//       });

//       const urls = await Promise.all(signedUrlPromises);
//       const validUrls = urls.filter((url) => url !== null);

//       setImageUrls(validUrls);
//     }
//   } catch (error) {
//     console.error("Error fetching beach images:", error);
//   } finally {
//     setLoading(false);
//   }
// };

export async function getSignedImageUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("beach_images")
    .createSignedUrl(path, 7200);

  if (error) {
    console.error("Error creating URL:", error);
    return null;
  }

  return data.signedUrl;
}
