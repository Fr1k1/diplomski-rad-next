import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/ui/loginForm";

export default function LoginPage() {
  return (
    <div>
      <Card className="w-96 flex flex-col ">
        <CardHeader>
          <CardTitle className="text-primary-800 text-3xl">Login</CardTitle>
          <CardDescription>If you already have an account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
