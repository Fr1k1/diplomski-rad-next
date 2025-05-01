import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/ui/register-form";

export default function RegisterPage() {
  return (
    <div>
      <Card className="w-96 flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-primary-800 text-3xl">Register</CardTitle>
          <CardDescription>if you don't have an account</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <CardDescription>
            or{" "}
            <Link href="/login">
              <span className="underline text-secondary"> sign in </span>
            </Link>{" "}
            if you already have an account
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
