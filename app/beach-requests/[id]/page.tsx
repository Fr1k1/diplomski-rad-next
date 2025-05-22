import { prisma } from "@/lib/prisma";
import { ConfirmBeachRequestForm } from "@/components/ui/confirmBeachRequestForm";
import { notFound } from "next/navigation";
import { getBeachById } from "@/lib/serverFunctions";
import { getSignedImageUrlServer } from "@/app/common/storage";
import { Image } from "@/app/common/types";

export default async function ConfirmBeachRequestPage({
  params,
}: {
  params: { id: string };
}) {
  const beachId = parseInt(params.id);

  const beach = await getBeachById(beachId);

  if (!beach) {
    notFound();
  }

  const imageUrls = await Promise.all(
    beach.images?.map(async (image: Image) => {
      return await getSignedImageUrlServer(image.path);
    }) || []
  );

  const regularCharacteristics = beach.beach_has_characteristics
    .filter((char: { featured: boolean }) => !char.featured)
    .map((char: { characteristic_id: number }) => char.characteristic_id);

  const featuredItems = beach.beach_has_characteristics
    .filter((char: { featured: boolean }) => char.featured)
    .map((char: { characteristic_id: number }) =>
      char.characteristic_id.toString()
    );

  const initialBeachData = {
    id: beachId.toString(),
    name: beach.name,
    address: beach.address,
    beachTypeId: beach.beach_type_id.toString(),
    beachDepthId: beach.beach_depth_id.toString(),
    beachTextureId: beach.beach_texture_id.toString(),
    beach_country: beach.cities.countries.id.toString(),
    cityId: beach.city_id.toString(),
    working_hours: beach.working_hours,
    description: beach.description,
    best_time_to_visit: beach.best_time_to_visit,
    local_wildlife: beach.local_wildlife,
    restaurants_and_bars_nearby: beach.restaurants_and_bars_nearby,
    characteristics: regularCharacteristics,
    featured_items: featuredItems,
    userId: beach.user_id,
    imageUrls: imageUrls,
  };
  const [beachTypes, beachTextures, beachDepths, countries, characteristics] =
    await Promise.all([
      prisma.beach_types.findMany(),
      prisma.beach_textures.findMany(),
      prisma.beach_depths.findMany(),
      prisma.countries.findMany(),
      prisma.characteristics.findMany(),
    ]);

  const cities = await prisma.cities.findMany({
    where: {
      country_id: beach.cities.country_id,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <ConfirmBeachRequestForm
        initialBeachTypes={beachTypes}
        initialBeachTextures={beachTextures}
        initialBeachDepths={beachDepths}
        initialCountries={countries}
        initialCharacteristics={characteristics}
        initialCities={cities}
        initialBeachData={initialBeachData}
      />
    </div>
  );
}
