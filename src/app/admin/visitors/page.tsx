export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { Eye, Globe, ArrowLeft, Smartphone, Monitor, Compass, Clock } from "lucide-react";
import Link from "next/link";

export default async function VisitorsPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalViews = 0;
  let uniqueIPs = 0;
  let todayViews = 0;
  let weekViews = 0;
  let monthViews = 0;
  let visitorLogs: any[] = [];

  try {
    const [tViews, uIPs, tToday, tWeek, tMonth, logs] = await Promise.all([
      prisma.visitorLog.count().catch(() => 0),
      prisma.visitorLog
        .groupBy({ by: ["ip"] })
        .then((res) => res.length)
        .catch(() => 0),
      prisma.visitorLog
        .count({ where: { visitedAt: { gte: startOfToday } } })
        .catch(() => 0),
      prisma.visitorLog
        .count({ where: { visitedAt: { gte: startOfWeek } } })
        .catch(() => 0),
      prisma.visitorLog
        .count({ where: { visitedAt: { gte: startOfMonth } } })
        .catch(() => 0),
      prisma.visitorLog
        .findMany({
          orderBy: { visitedAt: "desc" },
          take: 100,
        })
        .catch(() => []),
    ]);

    totalViews = tViews;
    uniqueIPs = uIPs;
    todayViews = tToday;
    weekViews = tWeek;
    monthViews = tMonth;
    visitorLogs = logs;
  } catch (err) {
    console.warn("Database notice in VisitorsPage:", err);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Traffic Analysis &amp; Visitor Logs</h1>
          <p className="text-foreground/60 text-sm mt-1">Aggregate traffic metrics and recent browsing activity.</p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 text-xs font-bold text-foreground/70 hover:text-primary transition-colors border border-gray-200 bg-white px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-foreground/60 font-medium">Views Today</p>
            <p className="text-2xl font-bold text-foreground">{todayViews}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Compass size={20} />
          </div>
          <div>
            <p className="text-xs text-foreground/60 font-medium">Last 7 Days</p>
            <p className="text-2xl font-bold text-foreground">{weekViews}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-xs text-foreground/60 font-medium">This Month</p>
            <p className="text-2xl font-bold text-foreground">{monthViews}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Globe size={20} />
          </div>
          <div>
            <p className="text-xs text-foreground/60 font-medium">Unique Visitors</p>
            <p className="text-2xl font-bold text-foreground">{uniqueIPs}</p>
          </div>
        </div>
      </div>

      {/* Table of Recent Hits */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
            Live Traffic Stream (Latest 100 Page Views)
          </h2>
          <span className="text-xs text-foreground/50">{visitorLogs.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-foreground/80 font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">IP (Masked)</th>
                <th className="p-4">Referrer</th>
                <th className="p-4">Browser &amp; Platform</th>
                <th className="p-4">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitorLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-foreground/50">
                    No visitor logs recorded yet.
                  </td>
                </tr>
              ) : (
                visitorLogs.map((log) => {
                  const isMobile = log.userAgent?.toLowerCase().includes("mobile");
                  const maskedIp = log.ip
                    ? log.ip.split(".").slice(0, 3).join(".") + ".xxx"
                    : "127.0.0.xxx";

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-foreground/70 font-mono">
                        {new Date(log.visitedAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-mono font-medium text-foreground">{maskedIp}</td>
                      <td className="p-4 text-foreground/70 truncate max-w-[150px]" title={log.referrer || "direct"}>
                        {log.referrer || "direct"}
                      </td>
                      <td className="p-4 text-foreground/60 flex items-center gap-1.5 truncate max-w-[200px]" title={log.userAgent || "unknown"}>
                        {isMobile ? <Smartphone size={14} className="flex-shrink-0 text-primary" /> : <Monitor size={14} className="flex-shrink-0 text-gray-500" />}
                        <span className="truncate">{log.userAgent || "standard browser"}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                          {log.path}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
