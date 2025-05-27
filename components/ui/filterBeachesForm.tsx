"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./form";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./label";
import { Button } from "./button";
import { Faders, X } from "@phosphor-icons/react";
import CharacteristicsClient from "./characteristicsClient";
import { FormEvent, useState } from "react";

const formSchema = z.object({
  characteristics: z.array(z.number()).optional(),
  waterType: z.string().optional(),
  beachTexture: z.string().optional(),
});

interface FilterBeachesFormProps {
  countryId: string;
  initialFilters: {
    cityId?: string;
    waterTypeId?: string;
    beachTextureId?: string;
    characteristicIds?: number[];
  };
  beachRelatedData: {
    beachTypes: any[];
    beachTextures: any[];
    beachCharacteristics: any[];
  };
}

export default function FilterBeachesForm({
  countryId,
  initialFilters,
  beachRelatedData,
}: FilterBeachesFormProps) {
  const { beachTypes, beachTextures, beachCharacteristics } = beachRelatedData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      characteristics: initialFilters.characteristicIds || [],
      waterType: initialFilters.waterTypeId || "",
      beachTexture: initialFilters.beachTextureId || "",
    },
  });

  const updateUrl = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formValues = form.getValues();

    const params = new URLSearchParams(searchParams.toString());
    if (initialFilters.cityId) {
      params.set("city", initialFilters.cityId);
    }

    if (formValues.waterType) {
      params.set("waterType", formValues.waterType);
    } else {
      params.delete("waterType");
    }

    if (formValues.beachTexture) {
      params.set("beachTexture", formValues.beachTexture);
    } else {
      params.delete("beachTexture");
    }

    if (formValues.characteristics && formValues.characteristics.length > 0) {
      params.set("characteristics", formValues.characteristics.join(","));
    } else {
      params.delete("characteristics");
    }
    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const clearAllFilters = () => {
    form.reset({
      characteristics: [],
      waterType: "",
      beachTexture: "",
    });
    if (initialFilters.cityId) {
      router.push(`${pathname}?city=${initialFilters.cityId}`);
    } else {
      router.push(pathname);
    }

    setIsFilterOpen(false);
  };

  return (
    <>
      <Button variant={"secondary"} onClick={() => setIsFilterOpen(true)}>
        <Faders weight="duotone" className="mr-2" size={32} />
        Filter
      </Button>

      {isFilterOpen && (
        <div className="bg-gradient-to-r from-primary-800 to-gray-800 z-50 absolute left-0 w-full">
          <div className="max-w-screen-2xl m-auto p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-2xl font-bold">Filter beaches</h3>
              <X
                size={32}
                color="#06B6D4"
                onClick={() => setIsFilterOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <Form {...form}>
              <form onSubmit={updateUrl} id="filter-form">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-60">
                    <div className="w-44">
                      <p className="text-white">Water type</p>
                      <Tabs
                        className="bg-white p-1 rounded-lg"
                        defaultValue={form.getValues("waterType") || undefined}
                        onValueChange={(value) =>
                          form.setValue("waterType", value)
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          {beachTypes.map((beachType) => (
                            <TabsTrigger
                              key={beachType.id}
                              value={beachType.id.toString()}
                            >
                              {beachType.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>

                    <div>
                      <Select
                        defaultValue={
                          form.getValues("beachTexture") || undefined
                        }
                        onValueChange={(value) =>
                          form.setValue("beachTexture", value)
                        }
                      >
                        <Label htmlFor="" className="text-white">
                          Beach texture
                        </Label>
                        <SelectTrigger>
                          <SelectValue placeholder="Select beach texture" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Beach textures</SelectLabel>
                            {beachTextures.map((beachTexture) => (
                              <SelectItem
                                key={beachTexture.id}
                                value={beachTexture.id.toString()}
                              >
                                {beachTexture.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-white">
                    <h2 className="mb-2">Characteristics</h2>
                    <CharacteristicsClient
                      form={form}
                      characteristics={beachCharacteristics}
                    />
                  </div>
                </div>
              </form>
            </Form>

            <div className="flex flex-col items-end gap-4">
              <Button
                className="w-80"
                variant={"darker"}
                type="submit"
                form="filter-form"
              >
                Search
              </Button>
              <Button
                className="w-80"
                variant={"secondary"}
                onClick={clearAllFilters}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
