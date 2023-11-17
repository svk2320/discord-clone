import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    console.log("!profile");
    return redirectToSignIn();
  }

  console.log("params", params.inviteCode);
  if (!params.inviteCode) {
    console.log("one");
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

  //   http://localhost:3000/invite/c3b9dbb3-900e-4e6a-bba0-1a6363c8d11a

  if (existingServer) {
    console.log('two')
    console.log('two',  existingServer)
    return redirect(`/servers/${existingServer.id}`);
  }

  const existingServers = await db.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  console.log("existingServers", existingServers);

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
      memberIds: [...existingServers.memberIds, profile.id]
    },
  });

  if (server) {
    console.log("three");
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
