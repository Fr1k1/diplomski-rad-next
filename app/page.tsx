import CardsGrid from "@/components/ui/cardsGrid";
import Hero from "@/components/ui/hero";
import MapSearcher from "@/components/ui/mapSearcher";
import { prisma } from "@/lib/prisma";
import { City } from "./types/City";
import { getBeachesByType, getCitiesByCountry } from "@/lib/api";
import { calculateAverageRating } from "./common/utils";

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
  const convertedCountries = countries.map((country) => ({
    ...country,
    id: String(country.id),
  }));

  const countryIdFromPath = params.countryId || "";
  const cityIdFromUrl = searchParams.city || "";

  let cities: City[] = [];
  if (countryIdFromPath) {
    cities = await getCitiesByCountry(countryIdFromPath);
  }

  const allBeaches = [...riverBeaches, ...seaBeaches];
  const beachesWithRating = allBeaches.map((beach) => ({
    ...beach,
    calculatedRating: calculateAverageRating(beach?.reviews),
  }));
  const sortedBeaches = beachesWithRating.sort(
    (a, b) => b.calculatedRating - a.calculatedRating
  );
  const bestRatedBeaches = sortedBeaches.slice(0, 4);
  return (
    <div>
      <Hero />
      <div className=" flex flex-col gap-6">
        <CardsGrid
          hasMoreButton
          title="Top picks this season"
          cardData={bestRatedBeaches}
        />
        <MapSearcher
          initialCountries={convertedCountries}
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
