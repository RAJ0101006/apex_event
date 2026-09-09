export const dynamic = "force-dynamic";

import { prisma, DEFAULT_FAQS } from "@/lib/db";
import FaqsClient from "./FaqsClient";

export default async function FaqsPage() {
  let faqs: any[] = [];
  try {
    faqs = await prisma.faq.findMany({
      where: { isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
    if (faqs.length === 0) {
      faqs = DEFAULT_FAQS as any[];
    }
  } catch (error) {
    console.warn("Database notice in FaqsPage:", error);
    faqs = DEFAULT_FAQS as any[];
  }

  return <FaqsClient initialFaqs={faqs} />;
}
