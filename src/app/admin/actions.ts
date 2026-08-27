"use server"

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const featured = formData.get("featured") === "on";

  await prisma.event.create({
    data: { title, description, category, imageUrl, featured },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const featured = formData.get("featured") === "on";

  await prisma.service.create({
    data: { title, description, imageUrl, featured },
  });
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function createTeamMember(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const visible = formData.get("visible") === "on";

  await prisma.teamMember.create({
    data: { name, role, imageUrl, visible },
  });
  revalidatePath("/admin/team");
  revalidatePath("/");
}

export async function createLead(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const date = formData.get("date") as string;
  const service = formData.get("service") as string;
  const budget = formData.get("budget") as string;
  const message = formData.get("message") as string;

  await prisma.lead.create({
    data: { name, phone, date, service, budget, message },
  });
  revalidatePath("/admin/leads");
}
