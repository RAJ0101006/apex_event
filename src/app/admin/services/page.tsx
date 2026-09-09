export const dynamic = "force-dynamic";

import { prisma, DEFAULT_SERVICES } from "@/lib/db";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
    if (services.length === 0) {
      services = DEFAULT_SERVICES as any[];
    }
  } catch (error) {
    console.warn("Database notice in ServicesPage:", error);
    services = DEFAULT_SERVICES as any[];
  }

  return <ServicesClient initialServices={services} />;
}
