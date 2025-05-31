import BeachRequestsClient from "@/components/ui/beachRequestsClient";
import { getBeachRequests } from "../api/beaches/actions";

export default async function BeachRequestsPage() {
  const data = await getBeachRequests();

  return <BeachRequestsClient initialBeachRequests={data.beaches as any} />;
}
