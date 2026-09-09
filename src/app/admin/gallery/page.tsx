export const dynamic = "force-dynamic";

import { prisma, DEFAULT_EVENTS } from "@/lib/db";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    if (events.length === 0) {
      events = DEFAULT_EVENTS as any[];
    }
  } catch (error) {
    console.warn("Database notice in GalleryPage:", error);
    events = DEFAULT_EVENTS as any[];
  }

  return <GalleryClient initialEvents={events} />;
}
