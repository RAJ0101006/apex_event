export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Users,
  Image as ImageIcon,
  Briefcase,
  MessageSquare,
  Eye,
  Globe,
  Calendar,
  PlusCircle,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  Phone,
} from "lucide-react";

export default async function AdminDashboard() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  let eventsCount = 0;
  let servicesCount = 0;
  let teamCount = 0;
  let testimonialsCount = 0;
  let leadsCount = 0;
  let newLeadsCount = 0;
  let followUpsDueCount = 0;
  let totalVisits = 0;
  let uniqueVisits = 0;
  let recentLeads: any[] = [];
  let followUpsDue: any[] = [];

  try {
    const [
      eCount,
      sCount,
      tCount,
      testCount,
      lCount,
      nLCount,
      fCount,
      vCount,
      uCount,
      rLeads,
      fLeads,
    ] = await Promise.all([
      prisma.event.count({ where: { isDeleted: false } }).catch(() => 6),
      prisma.service.count({ where: { isDeleted: false } }).catch(() => 4),
      prisma.teamMember.count({ where: { isDeleted: false } }).catch(() => 2),
      prisma.testimonial.count({ where: { isDeleted: false } }).catch(() => 0),
      prisma.lead.count().catch(() => 0),
      prisma.lead.count({ where: { status: "New" } }).catch(() => 0),
      prisma.lead.count({
        where: {
          status: "Follow-up",
          followUpDate: { lte: todayEnd },
        },
      }).catch(() => 0),
      prisma.visitorLog.count().catch(() => 0),
      prisma.visitorLog
        .groupBy({ by: ["ip"] })
        .then((res) => res.length)
        .catch(() => 0),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }).catch(() => []),
      prisma.lead.findMany({
        where: {
          status: "Follow-up",
          followUpDate: { lte: todayEnd },
        },
        orderBy: { followUpDate: "asc" },
        take: 4,
      }).catch(() => []),
    ]);

    eventsCount = eCount;
    servicesCount = sCount;
    teamCount = tCount;
    testimonialsCount = testCount;
    leadsCount = lCount;
    newLeadsCount = nLCount;
    followUpsDueCount = fCount;
    totalVisits = vCount;
    uniqueVisits = uCount;
    recentLeads = rLeads;
    followUpsDue = fLeads;
  } catch (err) {
    console.warn("Dashboard database fetch notice:", err);
  }

  const primaryStats = [
    { title: "New Inquiries", value: newLeadsCount, icon: MessageSquare, href: "/admin/leads", color: "text-amber-600 bg-amber-50" },
    { title: "Follow-ups Due", value: followUpsDueCount, icon: Clock, href: "/admin/leads?filter=follow-up", color: "text-red-600 bg-red-50" },
    { title: "Total Leads", value: leadsCount, icon: Users, href: "/admin/leads", color: "text-blue-600 bg-blue-50" },
    { title: "Gallery Projects", value: eventsCount, icon: ImageIcon, href: "/admin/gallery", color: "text-purple-600 bg-purple-50" },
    { title: "Active Services", value: servicesCount, icon: Briefcase, href: "/admin/services", color: "text-emerald-600 bg-emerald-50" },
    { title: "Site Visitors", value: uniqueVisits, icon: Globe, href: "/admin/visitors", color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-foreground/60 text-sm mt-1">Welcome to the APEX EVENT Operations &amp; Lead Management Center.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs"
          >
            <PlusCircle size={16} />
            <span>Add Event</span>
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-gray-200 text-foreground rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-xs"
          >
            <MessageSquare size={16} />
            <span>Open Leads</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {primaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href} className="group block">
              <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl hover:border-primary/50 transition-all shadow-xs hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <span className={`p-2.5 rounded-xl ${stat.color}`}>
                    <Icon size={20} />
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs font-medium text-foreground/60 mt-0.5">{stat.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Action / Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Follow-ups Due Today Widget */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <Calendar size={18} />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">Follow-ups Due Today</h3>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {followUpsDue.length}
              </span>
            </div>

            {followUpsDue.length === 0 ? (
              <div className="text-center py-8 text-foreground/50 text-sm">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                No follow-ups due today! All leads are up to date.
              </div>
            ) : (
              <div className="space-y-3">
                {followUpsDue.map((lead) => (
                  <div key={lead.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-foreground">{lead.name}</p>
                      <p className="text-xs text-foreground/60">{lead.service} &bull; {lead.phone}</p>
                      {lead.notes && <p className="text-[11px] text-foreground/50 italic mt-0.5 truncate max-w-[200px]">{lead.notes}</p>}
                    </div>
                    <a
                      href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#20b858] transition-colors flex items-center gap-1 shadow-xs flex-shrink-0"
                    >
                      <Phone size={12} />
                      <span>Contact</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-primary hover:underline mt-4 pt-3 border-t border-gray-100"
          >
            <span>Manage All Follow-ups</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-4">Quick Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/gallery"
                className="p-3 bg-gray-50 hover:bg-primary/5 hover:border-primary/40 border border-gray-100 rounded-xl transition-all block text-center"
              >
                <ImageIcon size={20} className="mx-auto text-primary mb-1.5" />
                <p className="text-xs font-bold text-foreground">Add Portfolio</p>
                <p className="text-[10px] text-foreground/50">Direct device upload</p>
              </Link>
              <Link
                href="/admin/services"
                className="p-3 bg-gray-50 hover:bg-primary/5 hover:border-primary/40 border border-gray-100 rounded-xl transition-all block text-center"
              >
                <Briefcase size={20} className="mx-auto text-primary mb-1.5" />
                <p className="text-xs font-bold text-foreground">Manage Services</p>
                <p className="text-[10px] text-foreground/50">Core &amp; specialties</p>
              </Link>
              <Link
                href="/admin/team"
                className="p-3 bg-gray-50 hover:bg-primary/5 hover:border-primary/40 border border-gray-100 rounded-xl transition-all block text-center"
              >
                <Users size={20} className="mx-auto text-primary mb-1.5" />
                <p className="text-xs font-bold text-foreground">Meet Crew</p>
                <p className="text-[10px] text-foreground/50">Team &amp; stylists</p>
              </Link>
              <Link
                href="/admin/settings"
                className="p-3 bg-gray-50 hover:bg-primary/5 hover:border-primary/40 border border-gray-100 rounded-xl transition-all block text-center"
              >
                <Star size={20} className="mx-auto text-primary mb-1.5" />
                <p className="text-xs font-bold text-foreground">Site Settings</p>
                <p className="text-[10px] text-foreground/50">Contact &amp; socials</p>
              </Link>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex items-center justify-between">
            <span>Direct device upload active</span>
            <span className="font-bold text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Ready</span>
          </div>
        </div>

        {/* Business Summary Card */}
        <div className="bg-gradient-to-br from-primary/10 via-white to-gray-50 border border-primary/20 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full inline-block mb-3">
              APEX EVENT SURAT
            </span>
            <h3 className="font-heading font-bold text-xl text-foreground">Single Source of Truth</h3>
            <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
              All website content — portfolio, services, team, contact phone, and hero headlines — is dynamically served from the database with resilient fallback protection.
            </p>
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-primary/10">
            <div className="flex justify-between text-foreground/80">
              <span className="text-foreground/50">Location</span>
              <span className="font-semibold">Sarthana, Surat</span>
            </div>
            <div className="flex justify-between text-foreground/80">
              <span className="text-foreground/50">WhatsApp Inquiries</span>
              <span className="font-semibold text-emerald-700">+91 9023815963</span>
            </div>
            <div className="flex justify-between text-foreground/80">
              <span className="text-foreground/50">Storage Pipeline</span>
              <span className="font-semibold text-primary">Persistent Cloud / Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">Recent Inquiries</h2>
            <p className="text-xs text-foreground/60">Real-time incoming leads from the public website.</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Open Leads Desk</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-foreground/70 uppercase tracking-wider">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Service</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-foreground/50 text-sm">
                    No inquiries recorded yet. Submissions from the website will appear here instantly.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 font-bold text-foreground">{lead.name}</td>
                    <td className="p-4 text-foreground/70 font-mono text-xs">{lead.phone}</td>
                    <td className="p-4 text-foreground/80">{lead.date}</td>
                    <td className="p-4 text-foreground/80">{lead.service}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(
                          lead.name
                        )}, I am reaching out from APEX EVENT regarding your inquiry for ${encodeURIComponent(lead.service)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#20b858] transition-colors shadow-xs"
                      >
                        <Phone size={12} />
                        <span>WhatsApp</span>
                      </a>
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
