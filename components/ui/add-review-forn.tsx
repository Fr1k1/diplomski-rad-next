"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./button";
import { z } from "zod";
import { addReview } from "@/app/api/beaches/actions";
import Title from "./title";
import { Info, MapPin } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { notifyFailure } from "./toast";
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full"
      variant={"darker"}
      type="submit"
      disabled={pending}
    >
      {pending ? "Adding review..." : "Add review"}
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

  useEffect(() => {
    if (state?.success) {
      notifyFailure("Uspjesno ste dodali review");
    } else if (state?.error) {
      notifyFailure("Doslo je do pogreske" + state?.error);
    }
  }, [state]);

  const [rating, setRating] = useState(0);
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
            action={formAction}
            onSubmit={(e) => {
              const isValid = form.trigger();
              if (!isValid) {
                e.preventDefault();
              }
            }}
            className="space-y-8"
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
                        allowFraction
                        {...field}
                        onClick={(rate) => {
                          field.onChange(rate);
                          setRating(rate);
                        }}
                        initialValue={field.value}
                      />
                    </FormControl>
                    {/*radi server actions da se procesuira value, a form control ocekuje samo jedan child*/}
                    <input type="hidden" name="rating" value={rating} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end ">
              <SubmitButton />
            </div>
            {/*radi server actions da se procesuira value*/}
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="beachId" value={beachId} />
          </form>
        </Form>
      </div>
    </div>
  );
}
