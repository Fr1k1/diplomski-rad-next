import { prisma } from "@/lib/prisma";
import CardsGrid from "@/components/ui/cardsGrid";
import FilterBeachesForm from "@/components/ui/filterBeachesForm";
import { Button } from "@/components/ui/button";
import { getFilteredBeachesAction } from "@/app/api/beaches/actions";
import MapSearcher from "@/components/ui/mapSearcher";
import PaginationWrapper from "@/components/ui/paginationWrapper";

interface CountryPageProps {
  params: {
    id: string;
  };
  searchParams: {
    city?: string;
    waterType?: string;
    beachTexture?: string;
    characteristics?: string;
    page?: string;
  };
}

export default async function CountryPage({
  params,
  searchParams,
}: CountryPageProps) {
  const countryId = params.id;
  const renderMapSearcher = async () => {
    const [beachCountries, beachCities] = await Promise.all([
      prisma.countries.findMany(),
      prisma.cities.findMany(),
    ]);

    const convertedCountries = beachCountries.map((country) => ({
      ...country,
      id: String(country.id),
    }));

    return (
      <div className="flex flex-col gap-6">
        <MapSearcher
          initialCountries={convertedCountries}
          initialCities={beachCities}
          countryIdFromPath=""
          cityIdFromUrl=""
          hasMap={true}
        />
      </div>
    );
  };

  if (!countryId) {
    return await renderMapSearcher();
  }

  const parsedCountryId = parseInt(countryId);
  if (isNaN(parsedCountryId)) {
    return await renderMapSearcher();
  }

  const country = await prisma.countries.findUnique({
    where: { id: parsedCountryId },
  });

  if (!country) {
    return await renderMapSearcher();
  }

  const cityId = searchParams.city;
  const waterTypeId = searchParams.waterType;
  const beachTextureId = searchParams.beachTexture;
  const characteristicIds = searchParams.characteristics
    ? searchParams.characteristics.split(",").map((id) => Number(id))
    : undefined;
  const page = parseInt(searchParams.page || "1");

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

  const beaches = await getFilteredBeachesAction(filters, page, 9, countryId);

  const [
    beachTypes,
    beachTextures,
    beachCharacteristics,
    beachCities,
    beachCountries,
  ] = await Promise.all([
    prisma.beach_types.findMany(),
    prisma.beach_textures.findMany(),
    prisma.characteristics.findMany(),
    prisma.cities.findMany(),
    prisma.countries.findMany(),
  ]);

  const convertedCountries = beachCountries.map((country) => ({
    ...country,
    id: String(country.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <Button variant={"darkest"}>
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

      <MapSearcher
        initialCountries={convertedCountries}
        initialCities={beachCities}
        countryIdFromPath={countryId}
        cityIdFromUrl={cityId || ""}
        hasMap={false}
      />

      <CardsGrid
        hasMoreButton={false}
        title={"Filtered beaches"}
        cardData={beaches.data}
      />

      <PaginationWrapper totalPages={beaches.totalPages} />
    </div>
  );
}
