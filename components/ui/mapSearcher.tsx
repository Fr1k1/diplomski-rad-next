"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MapWrapper from "./mapWrapper";
import { Button } from "./button";
import Title from "./title";
import SelectFieldCustom from "./selectFieldCustom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { City } from "@/app/common/types";

const formSchema = z.object({
  beach_country: z.string().min(2, {
    message: "Beach country must be at least 2 characters.",
  }),
  beach_city: z.string().min(2, {
    message: "Beach city must be at least 2 characters.",
  }),
});

type MapSearcherProps = {
  hasMap?: boolean;
  initialCountries: Array<{ id: string; name: string }>;
  initialCities?: City[];
  countryIdFromPath?: string;
  cityIdFromUrl?: string;
};

export default function MapSearcher({
  hasMap = true,
  initialCountries = [],
  initialCities = [],
  countryIdFromPath = "",
  cityIdFromUrl = "",
}: MapSearcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cities, setCities] = useState<City[]>(initialCities);
  const [isCountryChanged, setIsCountryChanged] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>(cityIdFromUrl);
  const [selectedCountryId, setSelectedCountryId] =
    useState<string>(countryIdFromPath);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beach_country: countryIdFromPath || "",
      beach_city: cityIdFromUrl || "",
    },
  });
  const fetchCitiesByCountry = async (countryId: string) => {
    try {
      if (!countryId || countryId === "undefined" || countryId === "null") {
        return;
      }
      setSelectedCountryId(countryId);
      const response = await fetch(`/api/cities?countryId=${countryId}`);
      if (!response.ok) throw new Error("Failed to fetch cities");
      const citiesRes: City[] = await response.json();

      if (Array.isArray(citiesRes) && citiesRes.length > 0) {
        setCities(citiesRes);
      } else {
        setCities([]);
      }

      if (cityIdFromUrl && countryId === countryIdFromPath) {
        setSelectedCityId(cityIdFromUrl);
        form.setValue("beach_city", cityIdFromUrl);
      } else {
        setSelectedCityId("");
        form.setValue("beach_city", "");
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    }
  };

  useEffect(() => {
    if (initialCities && initialCities.length > 0) {
      setCities(initialCities);
    }

    if (countryIdFromPath) {
      fetchCitiesByCountry(countryIdFromPath);
      setIsCountryChanged(true);
    } else if (initialCountries && initialCountries.length > 0) {
      const defaultCountryId = initialCountries[0].id;
      if (defaultCountryId) {
        fetchCitiesByCountry(String(defaultCountryId));
        setIsCountryChanged(true);
        form.setValue("beach_country", String(defaultCountryId));
      } else {
        console.error("Id error:", initialCountries[0]);
      }
    }
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedCountryId) {
      const params = new URLSearchParams(searchParams.toString());

      if (selectedCityId) {
        params.set("city", selectedCityId);
      } else {
        params.delete("city");
      }

      const url = `/country/${selectedCountryId}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.push(url);
    }
  };

  useEffect(() => {
    setSelectedCityId(cityIdFromUrl || "");
    form.setValue("beach_city", cityIdFromUrl || "");
  }, [cityIdFromUrl, form]);

  return (
    <div className="px-4 lg:px-0">
      {hasMap && <Title className="mb-6">Find the perfect beach</Title>}

      <div className="flex flex-col gap-5 lg:flex-row">
        {hasMap && (
          <div className="lg:w-4/6">
            <MapWrapper cities={cities} />
          </div>
        )}

        <div>
          {hasMap && (
            <h2 className="text-gray-800 font-semibold text-xl mb-4">
              Start by selecting beach location
            </h2>
          )}

          <Form {...form}>
            <form
              onSubmit={handleSearch}
              className={
                hasMap ? "flex flex-col gap-4" : "flex flex-row items-end gap-4"
              }
            >
              <div>
                <SelectFieldCustom
                  form={form}
                  name="beach_country"
                  label="Beach country"
                  placeholder="Choose beach country"
                  options={initialCountries}
                  onValueChange={(value) => {
                    setIsCountryChanged(true);
                    fetchCitiesByCountry(value.toString());
                  }}
                />
              </div>

              <div>
                <SelectFieldCustom
                  form={form}
                  name="beach_city"
                  label="Beach city"
                  placeholder="Choose beach city"
                  options={cities}
                  disabled={!isCountryChanged}
                  onValueChange={(value) => {
                    setSelectedCityId(value.toString());
                  }}
                />
              </div>

              <Button variant="secondary" type="submit">
                Search
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
