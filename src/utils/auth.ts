import { createHmac, timingSafeEqual } from "node:crypto";

function getSecret(): string {
  return process.env.SESSION_SECRET || "dev-secret-change-in-production";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function createAuthToken(): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update("admin:authenticated");
  return `admin:authenticated.${hmac.digest("hex")}`;
}

export function verifyAuthToken(token: string): boolean {
  if (!token) return false;
  const expected = createAuthToken();
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const password = getAdminPassword();
  if (!password || !input) return false;
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(password);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
