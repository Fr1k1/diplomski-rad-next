"use client";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notifyFailure } from "./toast";
import { loginUser } from "@/app/auth/actions";
import FormFieldCustom from "./formFieldCustom";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

//useFormStatus mora se pozivati unutar funkcije i zato je gumb ovak
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full"
      variant={"darker"}
      type="submit"
      disabled={pending}
    >
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginUser, null);

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
  }, [state]);

  return (
    <Form {...form}>
      <form
        action={formAction}
        className="space-y-4"
        onSubmit={(e) => {
          const isValid = form.trigger();
          if (!isValid) {
            e.preventDefault();
          }
        }}
      >
        <FormFieldCustom name="email" placeholder="Email" form={form} />
        <FormFieldCustom name="password" placeholder="Password" form={form} />
        {state?.error && (
          <div className="text-sm font-medium text-destructive">
            {state.error}
          </div>
        )}
        <SubmitButton />
      </form>
    </Form>
  );
}
