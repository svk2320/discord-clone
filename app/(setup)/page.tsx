import { redirect } from "next/navigation";

import { db } from "@/lib/database";
import { initialProfile } from "@/lib/initialProfile";
import { InitialModal } from "@/components/modals/InitialModal";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      memberIds: {
        hasSome: [profile.id],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
