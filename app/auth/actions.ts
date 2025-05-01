"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data: authUser, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message || "Invalid email or password",
    };
  }

  if (authUser) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_admin, username, first_name, last_name, id")
      .eq("id", authUser.user.id)
      .single();

    if (userError) {
      return { success: false, error: "Failed to fetch user data" };
    }
  }

  redirect("/");
}
