"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateAdmin, createSession, getSessionUser } from "@/lib/auth";

const prisma = new PrismaClient();

// Auth Server Actions
export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Please fill in all fields." };
  }

  const isValid = await authenticateAdmin(username, password);
  if (!isValid) {
    return { error: "Invalid username or password." };
  }

  const session = await createSession(username);
  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

// Protected Site Management Actions
export async function createEvent(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) {
    throw new Error("Unauthorized");
  }

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

export async function deleteEvent(id: string) {
  const admin = await getSessionUser();
  if (!admin) {
    throw new Error("Unauthorized");
  }

  await prisma.event.delete({
    where: { id },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) {
    throw new Error("Unauthorized");
  }

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

export async function deleteService(id: string) {
  const admin = await getSessionUser();
  if (!admin) {
    throw new Error("Unauthorized");
  }

  await prisma.service.delete({
    where: { id },
  });
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function createTeamMember(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) {
    throw new Error("Unauthorized");
  }

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

export async function deleteTeamMember(id: string) {
  const admin = await getSessionUser();
  if (!admin) {
    throw new Error("Unauthorized");
  }

  await prisma.teamMember.delete({
    where: { id },
  });
  revalidatePath("/admin/team");
  revalidatePath("/");
}

// Public Form Submissions
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
