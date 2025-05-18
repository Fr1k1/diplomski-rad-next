import { createClient } from "@/utils/supabase/client";

export const getUserId = async (
  setUserId: React.Dispatch<React.SetStateAction<string>>,
  form: any
) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    setUserId(user.id);
    form.setValue("userId", user.id);
  }
};
