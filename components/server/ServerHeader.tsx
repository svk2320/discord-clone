"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole
}

const ServerHeader = ({server, role} : ServerHeaderProps) => {
  return (
    <div>ServerHeader</div>
  )
}

export default ServerHeader;