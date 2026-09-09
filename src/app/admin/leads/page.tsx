export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.lead.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Database notice in LeadsPage:", error);
  }

  return <LeadsClient initialLeads={leads} />;
}
