import { apiFetch } from "./client";
import type { Category } from "@/types";

export const categoriesApi = {
  list: () => apiFetch<Category[]>("/categories"),

  create: (body: { name: string; color?: string | null }) =>
    apiFetch<Category>("/categories", { method: "POST", body: JSON.stringify(body) }),

  remove: (id: number) => apiFetch<void>(`/categories/${id}`, { method: "DELETE" }),
};
