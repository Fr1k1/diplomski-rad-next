"use client";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notifyFailure } from "./toast";
import { loginUser } from "@/app/auth/actions";
import FormFieldCustom from "./formFieldCustom";
import { CardDescription } from "./card";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
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
      {isLoading ? "Logging in..." : "Login"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginUser, null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
          className="space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            setIsLoading(true);
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              formData.append(key, value);
            });
            formAction(formData);
          })}
        >
          <div className="grid w-full items-center gap-4">
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
            <CardDescription className="mb-6">
              Or{" "}
              <Link href="/register" className="underline text-secondary">
                sign up
              </Link>{" "}
              to create an account
            </CardDescription>
            <SubmitButton isLoading={isLoading} />
          </div>
        </form>
      </Form>
    </>
  );
}
