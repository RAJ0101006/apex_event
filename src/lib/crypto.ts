import crypto from "crypto";

// PBKDF2 configuration
const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha512";

/**
 * Generates a random cryptographic salt (hex string)
 */
export function generateSalt(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Hashes a password with the provided salt using PBKDF2
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LEN, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString("hex"));
    });
  });
}

/**
 * Verifies a plaintext password against a stored hash and salt
 */
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  try {
    const computedHash = await hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

/**
 * Cryptographically random token generator (for CSRF or sessions)
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}
