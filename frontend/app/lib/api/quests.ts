import { apiFetch } from "./client";
import type { CompleteResult, Quest, QuestInput } from "@/types";

export const questsApi = {
  list: (status?: "active" | "completed") =>
    apiFetch<Quest[]>(`/quests${status ? `?status=${status}` : ""}`),

  create: (body: QuestInput) =>
    apiFetch<Quest>("/quests", { method: "POST", body: JSON.stringify(body) }),

  update: (id: number, body: Partial<QuestInput>) =>
    apiFetch<Quest>(`/quests/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  remove: (id: number) => apiFetch<void>(`/quests/${id}`, { method: "DELETE" }),

  complete: (id: number) =>
    apiFetch<CompleteResult>(`/quests/${id}/complete`, { method: "POST" }),
};
