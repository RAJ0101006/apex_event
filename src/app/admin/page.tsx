export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import { Users, Image as ImageIcon, Briefcase, MessageSquare, Eye, Globe } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const [
    eventsCount,
    servicesCount,
    teamCount,
    leadsCount,
    totalVisits,
    uniqueVisits,
    recentVisitors
  ] = await Promise.all([
    prisma.event.count(),
    prisma.service.count(),
    prisma.teamMember.count(),
    prisma.lead.count(),
    prisma.visitorLog.count(),
    prisma.visitorLog.groupBy({
      by: ['ip']
    }).then(res => res.length),
    prisma.visitorLog.findMany({
      orderBy: { visitedAt: "desc" },
      take: 5
    })
  ]);

  const stats = [
    { title: "Past Events", value: eventsCount, icon: ImageIcon, href: "/admin/gallery", color: "text-blue-600 bg-blue-50" },
    { title: "Active Services", value: servicesCount, icon: Briefcase, href: "/admin/services", color: "text-emerald-600 bg-emerald-50" },
    { title: "Team Members", value: teamCount, icon: Users, href: "/admin/team", color: "text-purple-600 bg-purple-50" },
    { title: "Total Leads", value: leadsCount, icon: MessageSquare, href: "/admin/leads", color: "text-orange-600 bg-orange-50" },
    { title: "Total Page Views", value: totalVisits, icon: Eye, href: "/admin/visitors", color: "text-indigo-600 bg-indigo-50" },
    { title: "Unique Visitors", value: uniqueVisits, icon: Globe, href: "/admin/visitors", color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-foreground/60 mt-2">Welcome to the APEX EVENT Admin Portal.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block group">
            <div className="bg-white border border-gray-200 p-6 rounded-xl hover:border-primary/50 transition-colors shadow-sm hover:shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3.5 rounded-lg group-hover:bg-primary/10 transition-colors ${stat.color}`}>
                <stat.icon size={24} className="group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Visitor Insights & Quick Log */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Recent Traffic Logs</h2>
            <p className="text-sm text-foreground/60 mt-1">Real-time visitor logs from your website.</p>
          </div>
          <Link href="/admin/visitors" className="text-primary hover:underline text-sm font-bold">
            View All Logs &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-foreground/80 font-bold">
              <tr>
                <th className="p-3">IP Address</th>
                <th className="p-3">Referrer</th>
                <th className="p-3">Browser Agent</th>
                <th className="p-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentVisitors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50">No visitor logs recorded yet.</td>
                </tr>
              ) : (
                recentVisitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 font-mono font-medium text-foreground">{visitor.ip || "127.0.0.1"}</td>
                    <td className="p-3 text-foreground/70 truncate max-w-[150px]" title={visitor.referrer || "direct"}>
                      {visitor.referrer || "direct"}
                    </td>
                    <td className="p-3 text-foreground/60 truncate max-w-[250px]" title={visitor.userAgent || "unknown"}>
                      {visitor.userAgent || "unknown"}
                    </td>
                    <td className="p-3 text-right text-foreground/70 font-medium">
                      {new Date(visitor.visitedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
