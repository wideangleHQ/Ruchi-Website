import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "ruchi_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session?.value) return false;

  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  // Simple hash comparison — the cookie stores a hash of the password
  const expected = await hashPassword(password);
  return session.value === expected;
}

export async function setAdminSession(): Promise<void> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD not configured");

  const cookieStore = await cookies();
  const hash = await hashPassword(password);
  cookieStore.set(COOKIE_NAME, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/admin",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "ruchi_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
