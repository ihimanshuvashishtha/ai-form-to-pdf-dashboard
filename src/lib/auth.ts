"use client";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("portfolio_auth_user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function loginMockUser(email: string): AuthUser {
  const user: AuthUser = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    email,
    full_name: "Portfolio Demo Developer",
  };
  localStorage.setItem("portfolio_auth_user", JSON.stringify(user));
  return user;
}

export function logoutUser(): void {
  localStorage.removeItem("portfolio_auth_user");
}
