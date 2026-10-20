import { apiFetch } from "./client";
import type { AuthResponse, User } from "@/types";

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    apiFetch<AuthResponse>("/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/login", { method: "POST", body: JSON.stringify(body) }),

  logout: () => apiFetch<void>("/logout", { method: "POST" }),

  me: () => apiFetch<User>("/me"),
};
