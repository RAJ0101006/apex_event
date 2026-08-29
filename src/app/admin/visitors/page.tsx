export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import { Eye, Globe, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function VisitorsPage() {
  const [visitorLogs, totalViews, uniqueIPs] = await Promise.all([
    prisma.visitorLog.findMany({
      orderBy: { visitedAt: "desc" },
      take: 100 // Limit to latest 100 for performance
    }),
    prisma.visitorLog.count(),
    prisma.visitorLog.groupBy({
      by: ['ip']
    }).then(res => res.length)
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Traffic Analysis & Logs</h1>
          <p className="text-foreground/60 mt-2">Detailed list of the last 100 page views on the website.</p>
        </div>
        <Link 
          href="/admin" 
          className="inline-flex items-center space-x-2 text-sm text-foreground/70 hover:text-primary transition-colors border border-gray-200 bg-white px-4 py-2 rounded-xl shadow-xs font-bold"
        >
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm text-foreground/60 font-medium">Total Site Views</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{totalViews}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-sm text-foreground/60 font-medium">Unique Visitors</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{uniqueIPs}</p>
          </div>
        </div>
      </div>

      {/* Full Visitors Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-foreground">Live Web Hits</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-foreground/80 font-bold text-sm">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Referrer</th>
                <th className="p-4">User Agent String</th>
                <th className="p-4">Destination Path</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {visitorLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-foreground/50">
                    No visitor activity has been recorded yet.
                  </td>
                </tr>
              ) : (
                visitorLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 text-foreground/80 font-medium">
                      {new Date(log.visitedAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono font-medium text-foreground">{log.ip || "127.0.0.1"}</td>
                    <td className="p-4 text-foreground/70 select-all" title={log.referrer || "direct"}>
                      {log.referrer || "direct"}
                    </td>
                    <td className="p-4 text-foreground/60 max-w-xs truncate" title={log.userAgent || "unknown"}>
                      {log.userAgent || "unknown"}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                        {log.path}
                      </span>
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
