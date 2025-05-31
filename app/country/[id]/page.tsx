import { prisma } from "@/lib/prisma";
import CardsGrid from "@/components/ui/cardsGrid";
import FilterBeachesForm from "@/components/ui/filterBeachesForm";
import { Button } from "@/components/ui/button";
import { getFilteredBeachesAction } from "@/app/api/beaches/actions";
import MapSearcher from "@/components/ui/mapSearcher";
import PaginationWrapper from "@/components/ui/paginationWrapper";
import ActiveFilters from "@/components/ui/activeFilters";

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

  const [beachCountries, beachCities] = await Promise.all([
    prisma.countries.findMany(),
    prisma.cities.findMany(),
  ]);

  const convertedCountries = beachCountries.map((country) => ({
    ...country,
    id: String(country.id),
  }));

  const convertedCities = beachCities.map((city) => ({
    ...city,
    latitude: parseFloat(city.latitude.toString()),
    longitude: parseFloat(city.longitude.toString()),
    countryId: city.country_id,
  }));

  if (!countryId || isNaN(parseInt(countryId))) {
    return (
      <div className="flex flex-col gap-6">
        <MapSearcher
          initialCountries={convertedCountries}
          initialCities={convertedCities}
          countryIdFromPath=""
          cityIdFromUrl=""
          hasMap={true}
        />
      </div>
    );
  }

  const parsedCountryId = parseInt(countryId);
  const country = await prisma.countries.findUnique({
    where: { id: parsedCountryId },
  });

  if (!country) {
    return (
      <div className="flex flex-col gap-6">
        <MapSearcher
          initialCountries={convertedCountries}
          initialCities={convertedCities}
          countryIdFromPath=""
          cityIdFromUrl=""
          hasMap={true}
        />
      </div>
    );
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

  const PAGE_SIZE = 9;

  const beaches = await getFilteredBeachesAction(
    filters,
    page,
    PAGE_SIZE,
    countryId
  );

  const [beachTypes, beachTextures, beachCharacteristics] = await Promise.all([
    prisma.beach_types.findMany(),
    prisma.beach_textures.findMany(),
    prisma.characteristics.findMany(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <Button variant={"darkest"}>
          {cityName ? `${cityName}, ${country.name}` : country.name}
        </Button>

        <FilterBeachesForm
          initialFilters={filters}
          beachRelatedData={{
            beachTypes,
            beachTextures,
            beachCharacteristics,
          }}
        />
      </div>

      <ActiveFilters
        filters={filters}
        beachRelatedData={{ beachTypes, beachTextures, beachCharacteristics }}
      />

      <MapSearcher
        initialCountries={convertedCountries}
        initialCities={convertedCities}
        countryIdFromPath={countryId}
        cityIdFromUrl={cityId}
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
