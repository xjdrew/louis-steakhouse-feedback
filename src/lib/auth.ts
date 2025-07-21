import { cookies } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin-auth");
    return authCookie?.value === "true";
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("Authentication required");
  }
}