import { getBeachGeoDataById } from "@/app/api/beaches/actions";
import { AddReviewForm } from "@/components/ui/addReviewForm";
import { createClient } from "@/utils/supabase/server";

export default async function AddReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const beachId = params.id;

  const beachData = await getBeachGeoDataById(beachId);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  return (
    <div>
      <AddReviewForm beachId={beachId} beachData={beachData} userId={userId} />
    </div>
  );
}
