export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsPage() {
  let testimonials: any[] = [];
  try {
    testimonials = await prisma.testimonial.findMany({
      where: { isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.warn("Database notice in TestimonialsPage:", error);
  }

  return <TestimonialsClient initialTestimonials={testimonials} />;
}
