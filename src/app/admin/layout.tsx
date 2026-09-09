import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "./actions";
import AdminNavClient from "./components/AdminNavClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminNavClient username={session?.username || "ADMIN"} role={session?.role || "ADMIN"} logoutAction={logoutAction}>
        {children}
      </AdminNavClient>
    </div>
  );
}
