import { PrismaClient } from "@prisma/client";
import { MessageCircle } from "lucide-react";

const prisma = new PrismaClient();

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Leads & Inquiries</h1>
        <p className="text-foreground/60 mt-2">Manage inquiries from the website.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-foreground/80">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Event Date</th>
              <th className="p-4">Service</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-foreground/50">No leads found.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-foreground">{lead.name}</td>
                  <td className="p-4 text-foreground/80">{lead.phone}</td>
                  <td className="p-4 text-foreground/80">{lead.date}</td>
                  <td className="p-4 text-foreground/80">{lead.service}</td>
                  <td className="p-4 text-foreground/80">{lead.budget || "-"}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a 
                      href={`https://wa.me/91${lead.phone.replace(/\D/g,'')}?text=Hello ${lead.name}, I'm reaching out from APEX EVENT regarding your inquiry for ${lead.service}.`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-[#25D366] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#20b858] shadow-sm transition-colors"
                    >
                      <MessageCircle size={16} />
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
  );
}
