import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/database";
import { currentProfile } from "@/lib/currentProfile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      memberIds: {
        hasSome: [profile.id],
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const existingServerMembers = await db.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  if (existingServerMembers) {
    const server = await db.server.update({
      where: {
        inviteCode: params.inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId: profile.id,
            },
          ],
        },
        memberIds: [...existingServerMembers.memberIds, profile.id],
      },
    });

    if (server) {
      return redirect(`/servers/${server.id}`);
    }
  }

  return null;
};

export default InviteCodePage;
