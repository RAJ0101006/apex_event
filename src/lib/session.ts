const SECRET = process.env.ADMIN_SESSION_SECRET || "apex-event-secret-key-2026-prod-xyz";

/**
 * Signs a payload using HMAC-SHA256 with Web Crypto (Edge + Node compatible)
 */
export async function signPayload(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Creates a signed session token: USERNAME:ROLE:EXPIRES:SIGNATURE
 */
export async function createSession(username: string, role = "ADMIN"): Promise<string> {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${username.toUpperCase()}:${role}:${expires}`;
  const signature = await signPayload(payload);
  return `${payload}:${signature}`;
}

/**
 * Verifies a session token string (Edge + Node compatible)
 */
export async function verifySession(sessionStr: string): Promise<{ username: string; role: string } | null> {
  try {
    const parts = sessionStr.split(":");
    if (parts.length !== 4) return null;

    const [username, role, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || expires < Date.now()) return null;

    const payload = `${username}:${role}:${expiresStr}`;
    const expectedSignature = await signPayload(payload);

    if (signature === expectedSignature) {
      return { username, role };
    }
  } catch (error) {
    console.error("Error verifying session token:", error);
  }
  return null;
}
