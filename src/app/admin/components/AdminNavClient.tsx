"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Briefcase,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldAlert,
  HelpCircle,
  Star,
  LogOut,
  Menu,
  X,
  Crown,
  ExternalLink,
} from "lucide-react";

interface AdminNavClientProps {
  username: string;
  role: string;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}

export default function AdminNavClient({
  username,
  role,
  logoutAction,
  children,
}: AdminNavClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Gallery Manager", href: "/admin/gallery", icon: ImageIcon },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Team & Crew", href: "/admin/team", icon: Users },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    { name: "Leads Desk", href: "/admin/leads", icon: MessageSquare },
    { name: "Traffic Logs", href: "/admin/visitors", icon: BarChart3 },
    { name: "Website Settings", href: "/admin/settings", icon: Settings },
    { name: "Audit Logs", href: "/admin/audit", icon: ShieldAlert },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <Link href="/admin" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Crown size={20} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-primary leading-tight">APEX ADMIN</h2>
            <p className="text-[11px] text-foreground/50 font-medium">Event Management CMS</p>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-foreground/50 hover:text-foreground p-1"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Admin User Badge */}
      <div className="px-5 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{username}</p>
          <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">
            {role}
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-foreground/50 hover:text-primary transition-colors p-1"
          title="View Live Website"
        >
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "text-foreground/70 hover:bg-gray-100 hover:text-foreground"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-foreground/60"} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </form>
        <div className="mt-3 text-[11px] text-center text-foreground/40 font-medium">
          APEX EVENT &bull; Surat, Gujarat
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-foreground p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <Crown className="text-primary" size={20} />
            <span className="font-heading font-bold text-foreground text-sm uppercase tracking-wider">Apex Admin</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-foreground/60 hover:text-primary text-xs font-bold flex items-center gap-1"
          >
            <span>Live Site</span>
            <ExternalLink size={12} />
          </Link>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </>
  );
}
