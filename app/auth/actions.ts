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

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const username = formData.get("username") as string;
  const supabase = createClient();
  const { data: authUser, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        username,
      },
    },
  });

  if (authUser) {
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: authUser?.user?.id,
        username,
        email,
        first_name,
        last_name,
        is_admin: false,
      },
    ]);

    if (error) {
      return { success: false, message: "Something went wrong", error: true };
    }

    if (insertError) {
      return { success: false, message: "Error creating user profile" };
    }
    return { success: true, message: "Successful registration" };
  }

  return { success: false, message: "Unknown error occurred" };
}
