export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { ShieldAlert, User, Clock, Tag } from "lucide-react";

export default async function AuditLogsPage() {
  let logs: any[] = [];
  try {
    logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (error) {
    console.warn("Database notice in AuditLogsPage:", error);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Security &amp; Audit Trail</h1>
        <p className="text-foreground/60 text-sm mt-1">
          Chronological record of administrator mutations, creations, status updates, and deletions.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
            Latest 100 System Events
          </span>
          <span className="text-xs text-foreground/50">{logs.length} Events Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-foreground/70 uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-foreground/50">
                    No audit records logged yet. Operations such as login, adding portfolio items, and updating leads will be tracked here.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 text-foreground/70 whitespace-nowrap font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-foreground flex items-center gap-1.5">
                      <User size={14} className="text-primary" />
                      <span>{log.adminUser}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-[10px] font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-foreground/80">{log.entity}</td>
                    <td className="p-4 text-foreground/70">{log.details || "-"}</td>
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
