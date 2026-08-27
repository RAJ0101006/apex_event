import { PrismaClient } from "@prisma/client";
import { Users, Image as ImageIcon, Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const [eventsCount, servicesCount, teamCount, leadsCount] = await Promise.all([
    prisma.event.count(),
    prisma.service.count(),
    prisma.teamMember.count(),
    prisma.lead.count(),
  ]);

  const stats = [
    { title: "Past Events", value: eventsCount, icon: ImageIcon, href: "/admin/gallery" },
    { title: "Active Services", value: servicesCount, icon: Briefcase, href: "/admin/services" },
    { title: "Team Members", value: teamCount, icon: Users, href: "/admin/team" },
    { title: "Total Leads", value: leadsCount, icon: MessageSquare, href: "/admin/leads" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-foreground/60 mt-2">Welcome to the APEX EVENT Admin Portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block group">
            <div className="bg-white border border-gray-200 p-6 rounded-xl hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1 text-primary">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <stat.icon size={24} className="text-foreground/80 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
