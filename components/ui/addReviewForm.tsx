"use client";

import { useFormState } from "react-dom";
import { Button } from "./button";
import { z } from "zod";
import { addReview } from "@/app/api/beaches/actions";
import Title from "./title";
import { Info, MapPin } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { notifyFailure, notifySuccess } from "./toast";
import Subtitle from "./subtitle";
import FormFieldCustom from "./formFieldCustom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating } from "react-simple-star-rating";
//for clients, for server use next/router
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  rating: z.number().min(1, {
    message: "Rating is required.",
  }),
  userId: z.string().min(1, {
    message: "User id must not be null.",
  }),
  beachId: z.string().min(1, {
    message: "Beach id must not be null.",
  }),
});

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button className="px-24 mb-6" type="submit" disabled={isLoading}>
      {isLoading ? "Adding review..." : "Add review"}
    </Button>
  );
}

interface AddReviewFormProps {
  beachId: string;
  userId: string | undefined;
  beachData: any;
}

export function AddReviewForm({
  beachId,
  beachData,
  userId,
}: AddReviewFormProps) {
  const [state, formAction] = useFormState(addReview, null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.error) {
      notifyFailure("Something went wrong");
    }
    if (state?.success === true) {
      notifySuccess("Review added succesfully");
      router.push(`/beach/${beachId}`);
    }
    if (state) {
      setIsLoading(false);
    }
  }, [state]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      rating: 0,
      beachId: beachId,
      userId: userId,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Title className="">{beachData?.name}</Title>
      <div className="flex items-center bg-primary-800 rounded-lg px-4 py-2 w-fit">
        <MapPin weight="duotone" className="mr-2" size={32} color="white" />
        <div className="text-white">
          <p>
            {beachData?.city?.name} {beachData?.city?.country?.name}
          </p>
        </div>
      </div>
      <Subtitle>Review</Subtitle>
      <div className="flex items-center gap-3">
        <Info size={16} color="#0E7490" />
        <p>Your name will be shown with the review and everyone can see it</p>
      </div>

      <div>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(async (data) => {
              setIsLoading(true);
              const formData = new FormData();
              Object.entries(data).forEach(([key, value]) => {
                formData.append(key, String(value));
              });
              formAction(formData);
            })}
          >
            <FormFieldCustom name="title" placeholder="Title" form={form} />

            <FormFieldCustom
              name="description"
              placeholder="description"
              form={form}
              textarea
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel>Leave rating</FormLabel>
                    <FormControl>
                      <Rating
                        size={40}
                        transition
                        {...field}
                        onClick={(rate) => {
                          field.onChange(rate);
                        }}
                        initialValue={field.value}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end ">
              <SubmitButton isLoading={isLoading} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
