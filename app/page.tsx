import CardsGrid from "@/components/ui/cardsGrid";
import Hero from "@/components/ui/hero";
import MapSearcher from "@/components/ui/mapSearcher";
import { prisma } from "@/lib/prisma";
import { getBeachesByType, getCitiesByCountry } from "@/lib/api";
import { calculateAverageRating } from "./common/utils";
import { City } from "./common/types";

export default async function Home() {
  const riverBeaches = await getBeachesByType(1);
  const seaBeaches = await getBeachesByType(2);

  const countries = await prisma.countries.findMany({});
  const convertedCountries = countries.map((country) => ({
    ...country,
    id: String(country.id),
  }));

  let cities: City[] = [];
  let firstCountryId = "";
  let firstCityId = "";

  if (convertedCountries.length > 0) {
    firstCountryId = convertedCountries[0].id;
    cities = await getCitiesByCountry(firstCountryId);

    if (cities.length > 0) {
      firstCityId = cities[0].id.toString();
    }
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
      <div className="flex flex-col gap-6">
        <CardsGrid
          hasMoreButton={false}
          title="Top picks this season"
          cardData={bestRatedBeaches}
        />
        {convertedCountries.length > 0 && (
          <MapSearcher
            initialCountries={convertedCountries}
            initialCities={cities}
            countryIdFromPath={firstCountryId}
          />
        )}
        <CardsGrid
          title="Sea beaches"
          cardData={seaBeaches}
          hasMoreButton={false}
        />
        <CardsGrid
          hasMoreButton={false}
          title="River beaches"
          cardData={riverBeaches}
        />
      </div>
    </div>
  );
}
