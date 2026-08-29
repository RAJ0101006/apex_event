import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SESSION_SECRET || "apex-event-secret-key-2026-xyz";

const ADMIN_CREDENTIALS: Record<string, string> = {
  "RAJ": "RAJ@010106",
  "KAUSHIK": "KAUSHIK@030497"
};

// Runtime-agnostic simple HMAC-like SHA-256 signature using Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  
  // Use crypto.subtle which is supported in standard Node.js and Edge environments
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  const normalizedUsername = username.trim().toUpperCase();
  const expectedPassword = ADMIN_CREDENTIALS[normalizedUsername];
  return expectedPassword !== undefined && expectedPassword === password;
}

export async function createSession(username: string): Promise<string> {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${username.toUpperCase()}:${expires}`;
  const signature = await sha256(payload + SECRET);
  return `${payload}:${signature}`;
}

export async function verifySession(sessionStr: string): Promise<string | null> {
  try {
    const parts = sessionStr.split(":");
    if (parts.length !== 3) return null;
    
    const [username, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);
    if (expires < Date.now()) return null;
    
    const payload = `${username}:${expiresStr}`;
    const expectedSignature = await sha256(payload + SECRET);
    
    if (signature === expectedSignature) {
      return username;
    }
  } catch (error) {
    console.error("Error verifying session cookie:", error);
  }
  return null;
}

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  if (!sessionCookie) return null;
  return verifySession(sessionCookie);
}
