import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/database";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const existingMembers = await db.server.findMany({
      where: {
        id: params.serverId,
      },
    });

    const remainingMembers = existingMembers[0].memberIds.filter(
      (item) => item !== profile.id
    );

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        memberIds: {
          hasSome: [profile.id],
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
        memberIds: {
          set: [...remainingMembers],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
