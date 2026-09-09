import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Lead ID",
      "Name",
      "Phone",
      "Email",
      "Event Date",
      "Service",
      "Budget",
      "Venue/City",
      "Status",
      "Notes",
      "Follow-up Date",
      "Created At",
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = leads.map((l) => [
      escapeCsv(l.id),
      escapeCsv(l.name),
      escapeCsv(l.phone),
      escapeCsv(l.email),
      escapeCsv(l.date),
      escapeCsv(l.service),
      escapeCsv(l.budget),
      escapeCsv(l.venue),
      escapeCsv(l.status),
      escapeCsv(l.notes),
      escapeCsv(l.followUpDate ? l.followUpDate.toISOString().split("T")[0] : ""),
      escapeCsv(l.createdAt.toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="apex_leads_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Failed to export leads:", error);
    return NextResponse.json({ error: "Failed to generate CSV export." }, { status: 500 });
  }
}
