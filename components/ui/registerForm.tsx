"use client";

import { Form } from "@/components/ui/form";
import { useFormState } from "react-dom";
import { z } from "zod";
import { Button } from "./button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { notifyFailure } from "./toast";
import { registerUser } from "@/app/auth/actions";
import FormFieldCustom from "./formFieldCustom";
import { CardDescription } from "./card";
import Link from "next/link";

const formSchema = z.object({
  first_name: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(50, {
      message: "First name must not exceed 50 characters",
    }),
  last_name: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .max(50, {
      message: "Last name must not exceed 50 characters",
    }),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not exceed 30 characters",
    }),
  email: z
    .string()
    .email({
      message: "Invalid email address.",
    })
    .max(80, {
      message: "Email must not exceed 80 characters",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button
      className="w-full"
      variant={"darker"}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? "Registering..." : "Register"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerUser, null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state?.error) {
      notifyFailure("Something went wrong");
    }
    if (state) {
      setIsLoading(false);
    }
  }, [state]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            setIsLoading(true);
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              formData.append(key, value);
            });
            formAction(formData);
          })}
          className="mb-4"
          id="form"
        >
          <div className="grid w-full items-center gap-4 mb-6">
            <div className="flex flex-col space-y-1.5">
              <FormFieldCustom
                name="first_name"
                placeholder="First Name"
                form={form}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <FormFieldCustom
                name="last_name"
                placeholder="Last Name"
                form={form}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <FormFieldCustom
                name="username"
                placeholder="Username"
                form={form}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <FormFieldCustom name="email" placeholder="Email" form={form} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <FormFieldCustom
                name="password"
                placeholder="Password"
                form={form}
              />
            </div>
            {state?.error && (
              <div className="text-sm font-medium text-destructive">
                {state.error}
              </div>
            )}
          </div>
          <CardDescription className="mb-6">
            or{" "}
            <Link href="/login">
              <span className="underline text-secondary"> sign in </span>
            </Link>{" "}
            if you already have an account
          </CardDescription>
          <SubmitButton isLoading={isLoading} />
        </form>
      </Form>
    </>
  );
}
