import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CardsGrid from "@/components/ui/cardsGrid";
import FilterBeachesForm from "@/components/ui/filterBeachesForm";
import Pagination from "@/components/ui/Pagination/pagination";
import { Button } from "@/components/ui/button";
import { getFilteredBeachesAction } from "@/app/api/beaches/actions";

interface CountryPageProps {
  params: {
    id: string;
  };
  searchParams: {
    city?: string;
    waterType?: string;
    beachTexture?: string;
    characteristics?: string;
  };
}

export default async function CountryPage({
  params,
  searchParams,
}: CountryPageProps) {
  const countryId = params.id;
  const cityId = searchParams.city;
  const waterTypeId = searchParams.waterType;
  const beachTextureId = searchParams.beachTexture;
  const characteristicIds = searchParams.characteristics
    ? searchParams.characteristics.split(",").map((id) => Number(id))
    : undefined;

  const country = await prisma.countries.findUnique({
    where: { id: parseInt(countryId) },
  });

  if (!country) {
    notFound();
  }

  let cityName;
  if (cityId) {
    const city = await prisma.cities.findUnique({
      where: { id: parseInt(cityId) },
    });
    cityName = city?.name;
  }

  const filters = {
    cityId,
    waterTypeId,
    beachTextureId,
    characteristicIds,
  };

  const beaches = await getFilteredBeachesAction(countryId, filters);

  const [beachTypes, beachTextures, beachCharacteristics] = await Promise.all([
    prisma.beach_types.findMany(),
    prisma.beach_textures.findMany(),
    prisma.characteristics.findMany(),
  ]);
  const hasActiveFilters =
    !!waterTypeId || !!beachTextureId || !!characteristicIds;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <Button variant={"darkest"}>
          {/* <MapPin weight="duotone" className="mr-2" size={32} /> */}
          {cityName ? `${cityName}, ${country.name}` : country.name}
        </Button>

        <FilterBeachesForm
          countryId={countryId}
          initialFilters={filters}
          beachRelatedData={{
            beachTypes,
            beachTextures,
            beachCharacteristics,
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 lg:flex ">
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>Sea</p>
        </div>
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>Sand</p>
        </div>
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>Free parking</p>
        </div>
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>Restaurants</p>
        </div>
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>Free entry</p>
        </div>
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>Something other</p>
        </div>
      </div>

      <CardsGrid
        hasMoreButton
        title={hasActiveFilters ? "Filtered beaches" : "Beaches"}
        cardData={beaches}
      />

      {/* <Pagination totalPages={2} /> */}
    </div>
  );
}
