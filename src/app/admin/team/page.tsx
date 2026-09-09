export const dynamic = "force-dynamic";

import { prisma, DEFAULT_TEAM } from "@/lib/db";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  let team: any[] = [];
  try {
    team = await prisma.teamMember.findMany({
      where: { isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
    if (team.length === 0) {
      team = DEFAULT_TEAM as any[];
    }
  } catch (error) {
    console.warn("Database notice in TeamPage:", error);
    team = DEFAULT_TEAM as any[];
  }

  return <TeamClient initialTeam={team} />;
}
