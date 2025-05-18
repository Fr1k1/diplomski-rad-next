"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./button";
import { z } from "zod";
import { addBeach } from "@/app/api/beaches/actions";
import Title from "./title";
import Subtitle from "./subtitle";
import { useEffect, useState } from "react";
import FormFieldCustom from "./formFieldCustom";
import SelectFieldCustom from "./selectFieldCustom";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "@phosphor-icons/react";
import FileInput from "./fileInput";
import BeachTips from "./beachTips";
import { getCitiesByCountry } from "@/lib/api";
import { notifyFailure, notifySuccess } from "./toast";
import { getCitiesByCountryAction } from "@/app/api/cities/actions";
import CharacteristicsClient from "./characteristicsClient";
import { getUserId } from "@/lib/clientFunctions";

const formSchema = z.object({
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
  characteristics: z.array(z.number()).default([]),
  featured_items: z.array(z.string()).default([]),
  approved: z.boolean().default(false),
  userId: z.string().min(1, {
    message: "User id must not be null.",
  }),
  images: z.array(z.string()).default([]),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full"
      variant={"darker"}
      type="submit"
      disabled={pending}
    >
      {pending ? "Adding beach..." : "Create request"}
    </Button>
  );
}

interface AddBeachFormProps {
  initialBeachTypes: any[];
  initialBeachTextures: any[];
  initialBeachDepths: any[];
  initialCountries: any[];
  initialCharacteristics: any[];
}

export function AddBeachForm({
  initialBeachTypes,
  initialBeachTextures,
  initialBeachDepths,
  initialCountries,
  initialCharacteristics,
}: AddBeachFormProps) {
  const [state, formAction] = useFormState(addBeach, null);
  const [userId, setUserId] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      images: [],
    },
  });

  useEffect(() => {
    getUserId(setUserId, form);
  }, []);

  useEffect(() => {
    if (state?.success) {
      notifySuccess("Uspjeh");
      form.reset();
    } else if (state?.error) {
      notifyFailure("Neuspjeh");
    }
  }, [state, form]);

  const [beachTypes] = useState(initialBeachTypes);
  const [beachTextures] = useState(initialBeachTextures);
  const [beachDepths] = useState(initialBeachDepths);
  const [countries] = useState(initialCountries);
  const [cities, setCities] = useState([]);
  const [featuredCharacteristics] = useState(initialCharacteristics);
  const [images, setImages] = useState<File[]>([]);

  const [isCountryChanged, setIsCountryChanged] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<string[]>([]);

  useEffect(() => {
    form.setValue("featured_items", featuredItems);
  }, [featuredItems, form]);

  const [fileInputs, setFileInputs] = useState([0]);

  const addFileInput = () => {
    setFileInputs((prev) => [...prev, prev.length]);
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const [featuredItemFields] = useState([
    { name: "featured_item_1", label: "Featured Item" },
    { name: "featured_item_2", label: "Featured Item" },
    { name: "featured_item_3", label: "Featured Item" },
    { name: "featured_item_4", label: "Featured Item" },
    { name: "featured_item_5", label: "Featured Item" },
  ]);

  const handleCountryChange = async (countryId: string) => {
    setIsCountryChanged(true);

    try {
      const result = await getCitiesByCountryAction(countryId);
      if (result.success) {
        setCities(result?.data);
      } else {
        console.error("Error fetching cities:", result.error);
        setCities([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-0">
      <Title>Add new beach</Title>
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
                disabled={!isCountryChanged}
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

            <div>
              <FormLabel>Beach images</FormLabel>
              {fileInputs.map((id) => (
                <FileInput
                  key={id}
                  id={`picture-${id}`}
                  onFileChange={handleFileChange}
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
                      newItems[index] = value.toString();
                      setFeaturedItems(newItems.filter(Boolean));
                      form.setValue("featured_items", newItems.filter(Boolean));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <Subtitle className="mb-6">Characteristics</Subtitle>
            <CharacteristicsClient
              characteristics={initialCharacteristics}
              form={form}
            />
          </div>
          <BeachTips form={form} />
          <div className="flex justify-end">
            <SubmitButton />
          </div>

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
          {featuredItems.map((item, index) => (
            <input
              key={index}
              type="hidden"
              name="featured_items"
              value={item}
            />
          ))}
          {form.watch("characteristics")?.map((char, index) => (
            <input
              key={index}
              type="hidden"
              name="characteristics"
              value={char}
            />
          ))}
        </form>
      </Form>
    </div>
  );
}
