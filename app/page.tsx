import CardsGrid from "@/components/ui/cardsGrid";
import Hero from "@/components/ui/hero";
import MapSearcher from "@/components/ui/mapSearcher";
import { prisma } from "@/lib/prisma";
import { City } from "./types/City";
import { getBeachesByType, getCitiesByCountry } from "@/lib/api";

export default async function Home({
  params,
  searchParams,
}: {
  params: { countryId?: string };
  searchParams: { city?: string };
}) {
  const riverBeaches = await getBeachesByType(1);

  const seaBeaches = await getBeachesByType(2);

  const countries = await prisma.countries.findMany({});

  const countryIdFromPath = params.countryId || "";
  const cityIdFromUrl = searchParams.city || "";

  let cities: City[] = [];
  if (countryIdFromPath) {
    cities = await getCitiesByCountry(countryIdFromPath);
  }
  return (
    <div>
      <Hero />
      <div className=" flex flex-col gap-6">
        {/* <CardsGrid
          hasMoreButton
          title="Top picks this season"
          cardData={bestRatedBeaches}
        /> */}
        <MapSearcher
          initialCountries={countries}
          initialCities={cities}
          countryIdFromPath={countryIdFromPath}
          cityIdFromUrl={cityIdFromUrl}
        />
        <CardsGrid hasMoreButton title="Sea beaches" cardData={seaBeaches} />
        <CardsGrid
          hasMoreButton
          title="River beaches"
          cardData={riverBeaches}
        />
      </div>
    </div>
  );
}
