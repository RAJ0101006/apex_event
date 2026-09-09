export const dynamic = "force-dynamic";

import { getSafeSettings } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const settings = await getSafeSettings();
  return <SettingsClient initialSettings={settings as any} />;
}
