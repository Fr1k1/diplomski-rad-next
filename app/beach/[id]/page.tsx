import { getBeachImagesServer } from "@/app/common/storage";
import BeachDetailsClient from "@/components/ui/BeachDetailsClient";
import { getBeachById } from "@/lib/serverFunctions";

export default async function BeachDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const beach = await getBeachById(Number(params.id));

  const beachImages = await getBeachImagesServer(params.id);
  return <BeachDetailsClient beach={beach} beachImages={beachImages} />;
}
