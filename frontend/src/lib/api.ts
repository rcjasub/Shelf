import type { CurrentUser } from "../types/user";

const BASE_URL = "/api";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Wraps fetch with the two things every request against this API needs:
 * - credentials: "include" so the HttpOnly session cookie is sent/received
 * - the CSRF header echoed back from the XSRF-TOKEN cookie, for anything
 *   that isn't a GET (Spring Security rejects state-changing requests
 *   without it, regardless of whether the caller is authenticated)
 */
async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);

  if (method !== "GET" && method !== "HEAD") {
    const csrfToken = readCookie("XSRF-TOKEN");
    if (csrfToken) headers.set("X-XSRF-TOKEN", csrfToken);
    if (options.body) headers.set("Content-Type", "application/json");
  }

  return fetch(`${BASE_URL}${path}`, { ...options, method, headers, credentials: "include" });
}

export async function getHealth(): Promise<{ status: string }> {
  const res = await apiFetch("/health");
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function loginWithGoogle(credential: string): Promise<CurrentUser> {
  const res = await apiFetch("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) throw new Error(`Google sign-in failed: ${res.status}`);
  return res.json();
}

/** Returns the signed-in user, or null if there's no valid session. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const res = await apiFetch("/auth/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to load session: ${res.status}`);
  return res.json();
}

export async function logout(): Promise<void> {
  const res = await apiFetch("/auth/logout", { method: "POST" });
  if (!res.ok) throw new Error(`Logout failed: ${res.status}`);
}
