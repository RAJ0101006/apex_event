"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { authenticateAdmin, createSession, getSessionUser } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import {
  validateEventInput,
  validateServiceInput,
  validateTeamInput,
  validateLeadInput,
  sanitizeInput,
  isValidUrl,
} from "@/lib/validations";
import { deleteMediaFile } from "@/lib/storage";

// Helper to log audit events
async function logAudit(action: string, entity: string, entityId?: string, details?: string) {
  try {
    const admin = await getSessionUser();
    if (admin) {
      await prisma.auditLog.create({
        data: {
          adminUser: admin.username,
          action,
          entity,
          entityId,
          details,
        },
      });
    }
  } catch (err) {
    console.warn("Failed to write audit log:", (err as Error).message);
  }
}

// -------------------------------------------------------------
// Auth Server Actions
// -------------------------------------------------------------
export async function loginAction(formData: FormData) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // Check rate limit: max 5 attempts per 15 min
  const rateCheck = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rateCheck.success) {
    return {
      error: `Too many login attempts. Please wait ${Math.ceil(rateCheck.resetSeconds / 60)} minutes before trying again.`,
    };
  }

  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Please enter both username and password." };
  }

  const authResult = await authenticateAdmin(username, password);
  if (!authResult.success) {
    return {
      error: `Invalid credentials. ${rateCheck.remaining} attempt${rateCheck.remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // Reset rate limiter on successful authentication
  resetRateLimit(`login:${ip}`);

  const session = await createSession(authResult.user!.username, authResult.user!.role);
  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  });

  await logAudit("LOGIN", "AdminUser", authResult.user!.username, "Successful portal authentication");

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

// -------------------------------------------------------------
// Portfolio / Event Actions
// -------------------------------------------------------------
export async function createEvent(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const validation = validateEventInput(formData);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const { title, category, imageUrl, altText, description, date, venue, featured, active, sortOrder } = validation.data!;
  const storagePublicId = (formData.get("storagePublicId") as string) || null;

  const event = await prisma.event.create({
    data: {
      title,
      category,
      imageUrl,
      storagePublicId,
      altText,
      description,
      date,
      venue,
      featured,
      active,
      sortOrder,
    },
  });

  await logAudit("CREATE", "Event", event.id, `Created event: ${title} (${category})`);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true, id: event.id };
}

export async function updateEvent(id: string, formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const validation = validateEventInput(formData);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const { title, category, imageUrl, altText, description, date, venue, featured, active, sortOrder } = validation.data!;
  const storagePublicId = (formData.get("storagePublicId") as string) || undefined;

  await prisma.event.update({
    where: { id },
    data: {
      title,
      category,
      imageUrl,
      storagePublicId,
      altText,
      description,
      date,
      venue,
      featured,
      active,
      sortOrder,
    },
  });

  await logAudit("UPDATE", "Event", id, `Updated event: ${title}`);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteEvent(id: string, permanent = false) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  if (permanent) {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (existing?.storagePublicId || existing?.imageUrl) {
      await deleteMediaFile(existing.storagePublicId, existing.imageUrl);
    }
    await prisma.event.delete({ where: { id } });
    await logAudit("PERMANENT_DELETE", "Event", id, `Permanently deleted event: ${existing?.title}`);
  } else {
    await prisma.event.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    await logAudit("SOFT_DELETE", "Event", id, "Soft deleted event");
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function restoreEvent(id: string) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  await prisma.event.update({
    where: { id },
    data: { isDeleted: false, deletedAt: null },
  });

  await logAudit("RESTORE", "Event", id, "Restored event");
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// Services Actions
// -------------------------------------------------------------
export async function createService(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const validation = validateServiceInput(formData);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const { title, description, shortDescription, fullDescription, imageUrl, icon, featured, active, sortOrder } = validation.data!;

  const service = await prisma.service.create({
    data: {
      title,
      description,
      shortDescription,
      fullDescription,
      imageUrl,
      icon,
      featured,
      active,
      sortOrder,
    },
  });

  await logAudit("CREATE", "Service", service.id, `Created service: ${title}`);
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true, id: service.id };
}

export async function updateService(id: string, formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const validation = validateServiceInput(formData);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const { title, description, shortDescription, fullDescription, imageUrl, icon, featured, active, sortOrder } = validation.data!;

  await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      shortDescription,
      fullDescription,
      imageUrl,
      icon,
      featured,
      active,
      sortOrder,
    },
  });

  await logAudit("UPDATE", "Service", id, `Updated service: ${title}`);
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string, permanent = false) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  if (permanent) {
    await prisma.service.delete({ where: { id } });
    await logAudit("PERMANENT_DELETE", "Service", id, "Permanently deleted service");
  } else {
    await prisma.service.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    await logAudit("SOFT_DELETE", "Service", id, "Soft deleted service");
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// Team Actions
// -------------------------------------------------------------
export async function createTeamMember(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const validation = validateTeamInput(formData);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const { name, role, imageUrl, bio, phone, socialLinks, visible, sortOrder } = validation.data!;

  const member = await prisma.teamMember.create({
    data: { name, role, imageUrl, bio, phone, socialLinks, visible, sortOrder },
  });

  await logAudit("CREATE", "TeamMember", member.id, `Added team member: ${name} (${role})`);
  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true, id: member.id };
}

export async function updateTeamMember(id: string, formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const validation = validateTeamInput(formData);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const { name, role, imageUrl, bio, phone, socialLinks, visible, sortOrder } = validation.data!;

  await prisma.teamMember.update({
    where: { id },
    data: { name, role, imageUrl, bio, phone, socialLinks, visible, sortOrder },
  });

  await logAudit("UPDATE", "TeamMember", id, `Updated team member: ${name}`);
  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTeamMember(id: string, permanent = false) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  if (permanent) {
    await prisma.teamMember.delete({ where: { id } });
    await logAudit("PERMANENT_DELETE", "TeamMember", id, "Permanently deleted team member");
  } else {
    await prisma.teamMember.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    await logAudit("SOFT_DELETE", "TeamMember", id, "Soft deleted team member");
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// Testimonials Actions
// -------------------------------------------------------------
export async function createTestimonial(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const customerName = sanitizeInput(formData.get("customerName"));
  const review = sanitizeInput(formData.get("review"));
  const rating = parseInt(formData.get("rating") as string, 10) || 5;
  const eventType = sanitizeInput(formData.get("eventType")) || null;
  const date = sanitizeInput(formData.get("date")) || null;
  const photoUrl = sanitizeInput(formData.get("photoUrl")) || null;
  const featured = formData.get("featured") === "true" || formData.get("featured") === "on";
  const active = formData.get("active") !== "false";

  if (!customerName || !review) {
    throw new Error("Customer name and review are required.");
  }

  const item = await prisma.testimonial.create({
    data: { customerName, review, rating, eventType, date, photoUrl, featured, active },
  });

  await logAudit("CREATE", "Testimonial", item.id, `Created testimonial from: ${customerName}`);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true, id: item.id };
}

export async function deleteTestimonial(id: string) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  await prisma.testimonial.update({
    where: { id },
    data: { isDeleted: true },
  });

  await logAudit("DELETE", "Testimonial", id, "Deleted testimonial");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// FAQ Actions
// -------------------------------------------------------------
export async function createFaq(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const question = sanitizeInput(formData.get("question"));
  const answer = sanitizeInput(formData.get("answer"));
  const category = sanitizeInput(formData.get("category")) || "General";
  const active = formData.get("active") !== "false";
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  if (!question || !answer) {
    throw new Error("Both question and answer are required.");
  }

  const faq = await prisma.faq.create({
    data: { question, answer, category, active, sortOrder },
  });

  await logAudit("CREATE", "Faq", faq.id, `Created FAQ: ${question}`);
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  return { success: true, id: faq.id };
}

export async function deleteFaq(id: string) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  await prisma.faq.update({
    where: { id },
    data: { isDeleted: true },
  });

  await logAudit("DELETE", "Faq", id, "Deleted FAQ");
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// Leads Mini-CRM Actions
// -------------------------------------------------------------
export async function updateLeadStatus(id: string, status: string, notes?: string) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  await prisma.lead.update({
    where: { id },
    data: {
      status,
      notes: notes !== undefined ? sanitizeInput(notes) : undefined,
    },
  });

  await logAudit("UPDATE_STATUS", "Lead", id, `Updated status to: ${status}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}

export async function scheduleLeadFollowUp(id: string, followUpDate: string, notes?: string) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  await prisma.lead.update({
    where: { id },
    data: {
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      status: "Follow-up",
      notes: notes !== undefined ? sanitizeInput(notes) : undefined,
    },
  });

  await logAudit("SCHEDULE_FOLLOWUP", "Lead", id, `Scheduled follow-up for: ${followUpDate}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}

export async function archiveLead(id: string) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  await prisma.lead.update({
    where: { id },
    data: { isArchived: true },
  });

  await logAudit("ARCHIVE", "Lead", id, "Archived lead");
  revalidatePath("/admin/leads");
  return { success: true };
}

// Public Contact Form Submission with Rate Limiting and Honeypot
export async function createLead(formData: FormData) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // Rate check: max 5 submissions per 10 minutes per IP
  const rate = checkRateLimit(`lead:${ip}`, 5, 10 * 60 * 1000);
  if (!rate.success) {
    return {
      error: "Too many inquiries sent in a short time. Please wait a few minutes or message us on WhatsApp.",
    };
  }

  const validation = validateLeadInput(formData);
  if (!validation.isValid) {
    return { error: Object.values(validation.errors)[0] };
  }

  const { name, phone, email, date, service, budget, venue, message } = validation.data!;

  try {
    await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        date,
        service,
        budget: budget || null,
        venue: venue || null,
        message: message || null,
        status: "New",
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to save lead:", error);
    return { error: "Failed to submit inquiry. Please try again or reach out on WhatsApp." };
  }
}

// -------------------------------------------------------------
// Business Settings Actions
// -------------------------------------------------------------
export async function updateBusinessSettings(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin) throw new Error("Unauthorized");

  const businessName = sanitizeInput(formData.get("businessName")) || "APEX EVENT";
  const tagline = sanitizeInput(formData.get("tagline"));
  const phone = sanitizeInput(formData.get("phone")) || "+91 9023815963";
  const whatsapp = sanitizeInput(formData.get("whatsapp")) || "+91 9023815963";
  const email = sanitizeInput(formData.get("email")) || "contact@apexevent.in";
  const address = sanitizeInput(formData.get("address"));
  const googleMapsUrl = sanitizeInput(formData.get("googleMapsUrl"));
  const instagramUrl = sanitizeInput(formData.get("instagramUrl"));
  const facebookUrl = sanitizeInput(formData.get("facebookUrl")) || null;
  const youtubeUrl = sanitizeInput(formData.get("youtubeUrl")) || null;
  const heroTitle = sanitizeInput(formData.get("heroTitle"));
  const heroSubtitle = sanitizeInput(formData.get("heroSubtitle"));
  const heroImageUrl = sanitizeInput(formData.get("heroImageUrl")) || null;
  const primaryCtaText = sanitizeInput(formData.get("primaryCtaText")) || "Book Consultation";
  const primaryCtaLink = sanitizeInput(formData.get("primaryCtaLink")) || "#contact";
  const secondaryCtaText = sanitizeInput(formData.get("secondaryCtaText")) || "Chat on WhatsApp";
  const secondaryCtaLink = sanitizeInput(formData.get("secondaryCtaLink")) || "https://wa.me/919023815963";
  const aboutTitle = sanitizeInput(formData.get("aboutTitle")) || "About APEX EVENT";
  const aboutText = sanitizeInput(formData.get("aboutText")) || null;
  const metaTitle = sanitizeInput(formData.get("metaTitle"));
  const metaDescription = sanitizeInput(formData.get("metaDescription"));
  const keywords = sanitizeInput(formData.get("keywords")) || null;

  await prisma.businessSettings.upsert({
    where: { id: "apex_settings" },
    update: {
      businessName,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      googleMapsUrl,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      aboutTitle,
      aboutText,
      metaTitle,
      metaDescription,
      keywords,
    },
    create: {
      id: "apex_settings",
      businessName,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      googleMapsUrl,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      aboutTitle,
      aboutText,
      metaTitle,
      metaDescription,
      keywords,
    },
  });

  await logAudit("UPDATE_SETTINGS", "BusinessSettings", "apex_settings", "Updated centralized business settings");
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
