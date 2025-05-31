"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileInput from "@/components/ui/fileInput";
import { PlusCircle } from "@phosphor-icons/react";
import BeachTips from "@/components/ui/beachTips";
import Title from "@/components/ui/title";
import Subtitle from "@/components/ui/subtitle";
import FormFieldCustom from "@/components/ui/formFieldCustom";
import SelectFieldCustom from "@/components/ui/selectFieldCustom";
import { useFormState, useFormStatus } from "react-dom";
import CharacteristicsClient from "./characteristicsClient";
import { getCitiesByCountryAction } from "@/app/api/cities/actions";
import { confirmBeach } from "@/app/api/beaches/actions";
import { notifyFailure, notifySuccess } from "./toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, {
    message: "Beach name must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Beach address must be at least 2 characters.",
  }),
  beachTypeId: z.string().min(1, {
    message: "Beach type must be selected.",
  }),

  beachDepthId: z.string().min(1, {
    message: "Beach depth must be selected.",
  }),

  beach_country: z.string().min(1, {
    message: "Beach country must be selected.",
  }),

  beachTextureId: z.string().min(1, {
    message: "Beach texture must be selected.",
  }),

  cityId: z.string().min(1, {
    message: "Beach city must be selected.",
  }),

  working_hours: z.string().min(2, {
    message: "Working hours must be at least 2 characters.",
  }),

  description: z.string().min(2, {
    message: "Beach description must be at least 2 characters.",
  }),
  best_time_to_visit: z.string().min(2, {
    message: "Best time to visit must be at least 2 characters.",
  }),
  local_wildlife: z.string().min(2, {
    message: "Local wildlife must be at least 2 characters.",
  }),
  restaurants_and_bars_nearby: z.string().min(2, {
    message: "Beach and bars nearby must be at least 2 characters.",
  }),
  characteristics: z.array(z.number()).optional(),

  featured_items: z.array(z.string().optional()).default([]),

  approved: z.boolean().optional(),
  userId: z.string().min(1, {
    message: "User id must not be null.",
  }),

  images: z.array(z.string()).optional(),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="px-24 mb-6" type="submit" disabled={pending}>
      {pending ? "Updating beach..." : "Update beach"}
    </Button>
  );
}

interface ConfirmBeachRequestFormProps {
  initialBeachTypes: any[];
  initialBeachTextures: any[];
  initialBeachDepths: any[];
  initialCountries: any[];
  initialCharacteristics: any[];
  initialBeachData?: any;
}

export function ConfirmBeachRequestForm({
  initialBeachTypes,
  initialBeachTextures,
  initialBeachDepths,
  initialCountries,
  initialCharacteristics,
  initialBeachData,
}: ConfirmBeachRequestFormProps) {
  useEffect(() => {
    if (initialBeachData?.beach_country) {
      handleCountryChange(initialBeachData.beach_country);
    }
  }, [initialBeachData]);
  const [featuredItemFields] = useState([
    { name: "featured_item_1", label: "Featured Item" },
    { name: "featured_item_2", label: "Featured Item" },
    { name: "featured_item_3", label: "Featured Item" },
    { name: "featured_item_4", label: "Featured Item" },
    { name: "featured_item_5", label: "Featured Item" },
  ]);

  const [loading, setLoading] = useState(!initialBeachData);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialBeachData?.imageUrls || []
  );
  const [isCountryChanged, setIsCountryChanged] = useState(
    initialBeachData ? true : false
  );
  const [featuredItems, setFeaturedItems] = useState<string[]>(
    initialBeachData?.featured_items || []
  );

  const [state, formAction] = useFormState(confirmBeach, null);
  const [userId, setUserId] = useState("");

  const openNewWindow = (imagePath: string) => {
    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.document.body.innerHTML = `
  <html>
    <head>
      <title>Image Preview</title>
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
        img { max-width: 100%; max-height: 100vh; object-fit: contain; }
      </style>
    </head>
    <body>
      <img src="${imagePath}" alt="Image Preview">
    </body>
  </html>
`;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading beach data...</div>;
  }

  const [beachId, setBeachId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (initialBeachData?.id) {
      setBeachId(initialBeachData.id);
    }
  }, [initialBeachData]);

  const [beachTypes] = useState(initialBeachTypes);
  const [beachTextures] = useState(initialBeachTextures);
  const [beachDepths] = useState(initialBeachDepths);
  const [countries] = useState(initialCountries);
  const [cities, setCities] = useState<any[]>([]);
  const [featuredCharacteristics] = useState(initialCharacteristics);
  const [fileInputs, setFileInputs] = useState([0]);
  const [images, setImages] = useState<File[]>([]);

  const MAX_IMAGE_INPUT = 5;

  const addFileInput = () => {
    setFileInputs((prev) => {
      if (prev.length >= MAX_IMAGE_INPUT) {
        return prev;
      }
      return [...prev, prev.length];
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const handleCountryChange = async (countryId: string | number) => {
    const stringifiedCountryId = countryId.toString();

    setIsCountryChanged(true);

    try {
      const result = await getCitiesByCountryAction(stringifiedCountryId);
      if (result.success) {
        setCities(result?.data || []);
      } else {
        console.error("Error fetching cities:", result.error);
        setCities([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialBeachData
      ? {
          id: initialBeachData.id,
          name: initialBeachData.name,
          address: initialBeachData.address,
          beach_country: initialBeachData.beach_country,
          cityId: initialBeachData.cityId,
          beachTypeId: initialBeachData.beachTypeId,
          beachDepthId: initialBeachData.beachDepthId,
          beachTextureId: initialBeachData.beachTextureId,
          characteristics: initialBeachData.characteristics,
          approved: false,
          userId: initialBeachData.userId,
          description: initialBeachData.description,
          best_time_to_visit: initialBeachData.best_time_to_visit,
          local_wildlife: initialBeachData.local_wildlife,
          restaurants_and_bars_nearby:
            initialBeachData.restaurants_and_bars_nearby,
          working_hours: initialBeachData.working_hours,
          featured_items: initialBeachData.featured_items,
        }
      : {
          name: "",
          address: "",
          beach_country: "",
          cityId: "",
          beachTypeId: "",
          beachDepthId: "",
          beachTextureId: "",
          characteristics: [],
          approved: false,
          userId: "",
          description: "",
          best_time_to_visit: "",
          local_wildlife: "",
          restaurants_and_bars_nearby: "",
          working_hours: "",
          featured_items: [],
        },
  });

  useEffect(() => {
    if (state?.error) {
      notifyFailure("Something went wrong");
    }
    if (state?.success === true) {
      notifySuccess("Beach request confirmed succesfully");
      router.refresh();
      router.push(`/`);
    }
  }, [state, form]);

  useEffect(() => {
    if (initialBeachData) {
      setLoading(false);
      form.reset({
        id: initialBeachData.id,
        name: initialBeachData.name,
        address: initialBeachData.address,
        beach_country: initialBeachData.beach_country,
        cityId: initialBeachData.cityId,
        beachTypeId: initialBeachData.beachTypeId,
        beachDepthId: initialBeachData.beachDepthId,
        beachTextureId: initialBeachData.beachTextureId,
        characteristics: initialBeachData.characteristics,
        approved: false,
        userId: initialBeachData.userId,
        description: initialBeachData.description,
        best_time_to_visit: initialBeachData.best_time_to_visit,
        local_wildlife: initialBeachData.local_wildlife,
        restaurants_and_bars_nearby:
          initialBeachData.restaurants_and_bars_nearby,
        working_hours: initialBeachData.working_hours,
        featured_items: initialBeachData.featured_items || [],
      });

      setUserId(initialBeachData.userId || "");
      setFeaturedItems(initialBeachData.featured_items || []);
    }
  }, [initialBeachData, form]);

  useEffect(() => {
    form.setValue("featured_items", featuredItems);
  }, [featuredItems, form]);
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-0">
      <Title>Update Beach Request</Title>
      <Subtitle>Basic info</Subtitle>
      <Form {...form}>
        <form
          action={formAction}
          onSubmit={(e) => {
            const isValid = form.trigger();
            if (!isValid) {
              e.preventDefault();
            }
          }}
          className="space-y-8"
        >
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <FormFieldCustom
                form={form}
                name="name"
                label="Beach name"
                placeholder="Enter beach name"
              />

              <SelectFieldCustom
                form={form}
                name="beach_country"
                label="Beach country"
                placeholder="Choose beach country"
                options={countries}
                onValueChange={handleCountryChange}
              />

              <FormFieldCustom
                form={form}
                name="address"
                label="Beach address"
                placeholder="Enter beach address"
              />

              <SelectFieldCustom
                form={form}
                name="cityId"
                label="Beach city"
                placeholder="Choose beach city"
                options={cities}
                disabled={!isCountryChanged && !cities.length}
              />
            </div>

            <div className="flex flex-col gap-4">
              <SelectFieldCustom
                form={form}
                name="beachTypeId"
                label="Beach type"
                placeholder="Choose beach type"
                options={beachTypes}
              />

              <SelectFieldCustom
                form={form}
                name="beachTextureId"
                label="Beach texture"
                placeholder="Choose beach texture"
                options={beachTextures}
              />

              <FormFieldCustom
                form={form}
                name="working_hours"
                label="Beach working hours"
                placeholder="Enter beach working hours"
              />

              <FormField
                control={form.control}
                name="beachDepthId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beach depth</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose beach depth">
                            {beachDepths.find(
                              (beachDepthId) => beachDepthId.id == field.value
                            )?.description || "Choose beach depth"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Beach depths</SelectLabel>

                            {beachDepths.map((beachDepth) => (
                              <SelectItem
                                key={beachDepth.id}
                                value={beachDepth.id}
                              >
                                {beachDepth.description}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormFieldCustom
            form={form}
            name="description"
            label="Beach description"
            placeholder="Enter beach description"
            textarea
          />

          <div className="w-2/4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Subtitle>Images</Subtitle>
              <PlusCircle
                size={32}
                weight="fill"
                color="#0E7490"
                onClick={addFileInput}
                style={{ cursor: "pointer" }}
              />
            </div>

            {imageUrls.length > 0 && (
              <div className="mb-4">
                <FormLabel>Existing Images</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {imageUrls.map((imagePath, id) => (
                    <div key={id} className="relative">
                      <a
                        target="_blank"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          openNewWindow(imagePath);
                        }}
                      >
                        <img
                          src={imagePath}
                          alt={`Beach image ${id + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <FormLabel>Add New Images</FormLabel>
              {fileInputs.map((id) => (
                <FileInput
                  key={id}
                  id={`picture-${id}`}
                  onFileChange={handleFileChange}
                  name={`picture-${id}`}
                />
              ))}
            </div>
          </div>

          <div>
            <div>
              <Subtitle>Featured info (up to 5 items)</Subtitle>
              <div className="flex flex-col justify-between gap-6 lg:flex lg:flex-row">
                {featuredItemFields.map((field, index) => (
                  <SelectFieldCustom
                    key={index}
                    form={form}
                    name={`featured_items.${index}`}
                    label={field.label}
                    placeholder={`Choose ${field.label.toLowerCase()}`}
                    options={featuredCharacteristics}
                    onValueChange={(value) => {
                      const newItems = [...featuredItems];
                      if (value) {
                        newItems[index] = value.toString();
                      } else {
                        newItems.splice(index, 1);
                      }
                      const filteredItems = newItems.filter(Boolean);
                      setFeaturedItems(filteredItems);
                      form.setValue("featured_items", filteredItems);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <Subtitle className="mb-6">Characteristics</Subtitle>
            <CharacteristicsClient
              form={form}
              characteristics={initialCharacteristics}
            />
          </div>

          <BeachTips form={form} />

          <div className="flex justify-end">
            <SubmitButton />
          </div>
          <input type="hidden" name="id" value={beachId} />
          <input type="hidden" name="userId" value={userId} />
          <input
            type="hidden"
            name="beachTypeId"
            value={form.getValues().beachTypeId || ""}
          />
          <input
            type="hidden"
            name="beachDepthId"
            value={form.getValues().beachDepthId || ""}
          />
          <input
            type="hidden"
            name="beachTextureId"
            value={form.getValues().beachTextureId || ""}
          />

          <input
            type="hidden"
            name="cityId"
            value={form.getValues().cityId || ""}
          />

          {form
            .watch("characteristics")
            ?.map(
              (characteristicId, index) =>
                characteristicId && (
                  <input
                    key={`char-${index}`}
                    type="hidden"
                    name="characteristics"
                    value={characteristicId}
                  />
                )
            )}
          {featuredItems.map(
            (itemId, index) =>
              itemId && (
                <input
                  key={`featured-${index}`}
                  type="hidden"
                  name="featured_items"
                  value={itemId}
                />
              )
          )}
        </form>
      </Form>
    </div>
  );
}
