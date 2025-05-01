import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return (
    <div>
      <Card className="w-96 flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-primary-800 text-3xl">Login</CardTitle>
          <CardDescription>If you already have an account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <CardDescription className="mt-4">
            Or{" "}
            <Link href="/register" className="underline text-secondary">
              sign up
            </Link>{" "}
            to create an account
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
