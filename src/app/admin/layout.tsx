import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, Briefcase, Users, MessageSquare } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-heading font-bold text-primary">APEX ADMIN</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-foreground/80 hover:text-primary">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/gallery" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-foreground/80 hover:text-primary">
            <ImageIcon size={20} />
            <span>Gallery Manager</span>
          </Link>
          <Link href="/admin/services" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-foreground/80 hover:text-primary">
            <Briefcase size={20} />
            <span>Services</span>
          </Link>
          <Link href="/admin/team" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-foreground/80 hover:text-primary">
            <Users size={20} />
            <span>Team & Crew</span>
          </Link>
          <Link href="/admin/leads" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-foreground/80 hover:text-primary">
            <MessageSquare size={20} />
            <span>Leads Desk</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 text-sm text-center text-foreground/50">
          Apex Event &copy; 2024
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
