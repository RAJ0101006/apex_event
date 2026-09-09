import { cookies } from "next/headers";
import { prisma } from "./db";
import { verifyPassword, hashPassword, generateSalt } from "./crypto";
export { createSession, verifySession } from "./session";

/**
 * Authenticates an admin user server-side without exposing credentials
 */
export async function authenticateAdmin(username: string, password: string): Promise<{ success: boolean; user?: { username: string; role: string } }> {
  const normalizedUsername = username.trim().toUpperCase();

  try {
    // 1. Check database for registered AdminUser
    const dbUser = await prisma.adminUser.findUnique({
      where: { username: normalizedUsername },
    });

    if (dbUser) {
      const isValid = await verifyPassword(password, dbUser.passwordHash, dbUser.salt);
      if (isValid) {
        await prisma.adminUser.update({
          where: { id: dbUser.id },
          data: { lastLoginAt: new Date() },
        });
        return { success: true, user: { username: dbUser.username, role: dbUser.role } };
      }
    }
  } catch (error) {
    console.warn("Database notice during auth lookup:", (error as Error).message);
  }

  // 2. Server-side environment variable verification (Fallback / Initial Admin Setup)
  // Check if server environment has designated admin credentials configured
  const envAdminUser = (process.env.ADMIN_USER || "RAJ").toUpperCase();
  const envAdminPass = process.env.ADMIN_PASSWORD;

  if (envAdminPass && normalizedUsername === envAdminUser && password === envAdminPass) {
    return { success: true, user: { username: envAdminUser, role: "SUPER_ADMIN" } };
  }

  // 3. Fallback verification for established authorized administrators
  // Password hashes computed via PBKDF2 with unique salts (Zero plaintext passwords in code)
  const SYSTEM_ADMINS: Record<string, { salt: string; hash: string; role: string }> = {
    "RAJ": {
      salt: "a4f8d92b109e4c7a8123ef6789abcdef",
      hash: "8ef2570b5550a1df289433364f9bf80beaeaf7e6eaef25776d52f9b8061df9a8f4c45b8040a4555d491c1ecbc2bfe6f04944b47e2cbb105e4685a498bfe1b2c4",
      role: "SUPER_ADMIN"
    },
    "KAUSHIK": {
      salt: "b5e9c81a208f3d6b9012cd5678abcdef",
      hash: "1d0b1ea0cf98889aa3eb8e7751786ba113e63cb2b7bc45db7efef64983e200787e91f1bf43037f4039fc7ba3c401314144be704e6c3104e1bc2e84c35e3b6241",
      role: "ADMIN"
    }
  };

  const registeredSystemAdmin = SYSTEM_ADMINS[normalizedUsername];
  if (registeredSystemAdmin) {
    const isValid = await verifyPassword(password, registeredSystemAdmin.hash, registeredSystemAdmin.salt);
    if (isValid) {
      // Opportunistically seed into database if database is connected
      try {
        await prisma.adminUser.upsert({
          where: { username: normalizedUsername },
          update: { lastLoginAt: new Date() },
          create: {
            username: normalizedUsername,
            passwordHash: registeredSystemAdmin.hash,
            salt: registeredSystemAdmin.salt,
            role: registeredSystemAdmin.role,
            lastLoginAt: new Date(),
          },
        });
      } catch {
        // Silently continue if database is unavailable
      }
      return { success: true, user: { username: normalizedUsername, role: registeredSystemAdmin.role } };
    }
  }

  return { success: false };
}

/**
 * Creates a signed session token: USERNAME:ROLE:EXPIRES:SIGNATURE
/**
 * Retrieves authenticated session user from server cookies
 */
export async function getSessionUser(): Promise<{ username: string; role: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  if (!sessionCookie) return null;
  return verifySession(sessionCookie);
}
