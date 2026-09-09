"use client";

import { useState, useTransition } from "react";
import {
  Search,
  Filter,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Edit,
  CheckCircle2,
  AlertCircle,
  Archive,
  MessageCircle,
  ArrowUpDown,
  X,
} from "lucide-react";
import { updateLeadStatus, scheduleLeadFollowUp, archiveLead } from "../actions";

const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Follow-up",
  "Meeting Scheduled",
  "Quoted",
  "Confirmed",
  "Completed",
  "Cancelled",
  "Lost",
];

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  service: string;
  budget?: string | null;
  venue?: string | null;
  message?: string | null;
  status: string;
  notes?: string | null;
  assignedTo?: string | null;
  followUpDate?: Date | string | null;
  createdAt: Date | string;
}

export default function LeadsClient({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [activeLead, setActiveLead] = useState<LeadItem | null>(null);

  // Follow-up modal state
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState("");
  const [editingFollowUpDate, setEditingFollowUpDate] = useState("");
  const [isPending, startTransition] = useTransition();

  const openLeadDrawer = (lead: LeadItem) => {
    setActiveLead(lead);
    setEditingNotes(lead.notes || "");
    setEditingStatus(lead.status);
    setEditingFollowUpDate(
      lead.followUpDate ? new Date(lead.followUpDate).toISOString().split("T")[0] : ""
    );
  };

  const handleUpdateLead = async () => {
    if (!activeLead) return;

    startTransition(async () => {
      try {
        if (editingFollowUpDate) {
          await scheduleLeadFollowUp(activeLead.id, editingFollowUpDate, editingNotes);
        } else {
          await updateLeadStatus(activeLead.id, editingStatus, editingNotes);
        }
        setActiveLead(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to update lead");
      }
    });
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this lead?")) return;
    startTransition(async () => {
      try {
        await archiveLead(id);
        if (activeLead?.id === id) setActiveLead(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to archive lead");
      }
    });
  };

  // Filter and Search logic
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.venue && l.venue.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    const matchesService = serviceFilter === "All" || l.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Contacted":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Follow-up":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Meeting Scheduled":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Quoted":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelled":
      case "Lost":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const uniqueServices = Array.from(new Set(leads.map((l) => l.service).filter(Boolean)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Leads Desk &amp; Mini-CRM</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Track inquiries, update sales pipeline status, schedule follow-ups, and trigger WhatsApp outreach.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/leads/export"
            download
            className="px-4 py-2 bg-white border border-gray-200 text-foreground rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3.5 top-3 text-foreground/40" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, phone, email..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-foreground focus:border-primary focus:bg-white outline-none"
            >
              <option value="All">All Statuses</option>
              {LEAD_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-foreground focus:border-primary focus:bg-white outline-none"
            >
              <option value="All">All Services</option>
              {uniqueServices.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick status counters */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 text-xs">
          <button
            onClick={() => setStatusFilter("All")}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === "All" ? "bg-primary text-white" : "bg-gray-100 text-foreground/70"
            }`}
          >
            All ({leads.length})
          </button>
          <button
            onClick={() => setStatusFilter("New")}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === "New" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"
            }`}
          >
            New ({leads.filter((l) => l.status === "New").length})
          </button>
          <button
            onClick={() => setStatusFilter("Follow-up")}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === "Follow-up" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700"
            }`}
          >
            Follow-up ({leads.filter((l) => l.status === "Follow-up").length})
          </button>
          <button
            onClick={() => setStatusFilter("Confirmed")}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === "Confirmed" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            Confirmed ({leads.filter((l) => l.status === "Confirmed").length})
          </button>
        </div>
      </div>

      {/* Leads Table / Responsive Cards */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-foreground/70 uppercase tracking-wider">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Service &amp; Budget</th>
                <th className="p-4">Status</th>
                <th className="p-4">Follow-up</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-foreground/50 text-sm">
                    No leads found matching current search and filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isFollowUpOverdue =
                    lead.followUpDate && new Date(lead.followUpDate) < new Date();

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-foreground">{lead.name}</div>
                        <div className="text-xs text-foreground/60 font-mono mt-0.5">{lead.phone}</div>
                        {lead.email && <div className="text-[11px] text-foreground/50">{lead.email}</div>}
                      </td>

                      <td className="p-4">
                        <div className="font-medium text-foreground text-xs">{lead.date}</div>
                        {lead.venue && (
                          <div className="text-[11px] text-foreground/50 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} />
                            <span>{lead.venue}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="text-xs font-semibold text-foreground">{lead.service}</div>
                        <div className="text-[11px] text-foreground/50">{lead.budget || "Budget not specified"}</div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-4 text-xs">
                        {lead.followUpDate ? (
                          <div
                            className={`flex items-center gap-1 font-semibold ${
                              isFollowUpOverdue ? "text-red-600" : "text-foreground/70"
                            }`}
                          >
                            <Calendar size={13} />
                            <span>{new Date(lead.followUpDate).toLocaleDateString()}</span>
                            {isFollowUpOverdue && <span className="text-[10px] text-red-500 font-bold">(Due)</span>}
                          </div>
                        ) : (
                          <span className="text-foreground/40 text-[11px]">Not set</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Action with Prefilled Message */}
                          <a
                            href={`https://wa.me/91${lead.phone.replace(
                              /\D/g,
                              ""
                            )}?text=Hello%20${encodeURIComponent(
                              lead.name
                            )},%20I%20am%20reaching%20out%20from%20APEX%20EVENT%20regarding%20your%20inquiry%20for%20${encodeURIComponent(
                              lead.service
                            )}%20on%20${encodeURIComponent(lead.date)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20b858] transition-colors shadow-xs"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>

                          {/* Detail & Notes Button */}
                          <button
                            onClick={() => openLeadDrawer(lead)}
                            className="p-2 bg-gray-100 text-foreground/70 hover:text-primary hover:bg-gray-200 rounded-lg transition-colors"
                            title="Edit Status &amp; Notes"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Archive Button */}
                          <button
                            onClick={() => handleArchive(lead.id)}
                            className="p-2 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Archive Lead"
                          >
                            <Archive size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail & Follow-up Drawer Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Lead Management CRM
                </span>
                <h3 className="font-heading font-bold text-xl text-foreground mt-1">{activeLead.name}</h3>
                <p className="text-xs text-foreground/60">{activeLead.phone} &bull; {activeLead.service}</p>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-foreground/40 hover:text-foreground p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Original Inquiry Message */}
            {activeLead.message && (
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 mb-4 text-xs text-foreground/80">
                <span className="font-bold text-foreground block mb-1">Inquiry Message:</span>
                &ldquo;{activeLead.message}&rdquo;
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={editingFollowUpDate}
                    onChange={(e) => setEditingFollowUpDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Internal Notes &amp; Follow-up History
                </label>
                <textarea
                  rows={4}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record client preferences, quoted packages, venue notes, or call summaries..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <a
                  href={`https://wa.me/91${activeLead.phone.replace(
                    /\D/g,
                    ""
                  )}?text=Hello%20${encodeURIComponent(
                    activeLead.name
                  )},%20I%20am%20following%20up%20from%20APEX%20EVENT%20regarding%20your%20event%20planning.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#20b858] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveLead(null)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-foreground/70 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateLead}
                    disabled={isPending}
                    className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-xs disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
