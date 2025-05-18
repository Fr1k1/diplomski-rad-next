import { AddBeachForm } from "@/components/ui/addBeachForm";

import { prisma } from "@/lib/prisma";

export default async function AddBeachPage() {
  const [beachTypes, beachTextures, beachDepths, countries, characteristics] =
    await Promise.all([
      prisma.beach_types.findMany(),
      prisma.beach_textures.findMany(),
      prisma.beach_depths.findMany(),
      prisma.countries.findMany(),
      prisma.characteristics.findMany(),
    ]);
  return (
    <div className="container mx-auto py-8">
      <AddBeachForm
        initialBeachTypes={beachTypes}
        initialBeachTextures={beachTextures}
        initialBeachDepths={beachDepths}
        initialCountries={countries}
        initialCharacteristics={characteristics}
      />
    </div>
  );
}
