import { apiFetch } from "./client";
import type { HeroProgress } from "@/types";

export const heroApi = {
  buyStreakFreeze: () => apiFetch<HeroProgress>("/streak-freezes", { method: "POST" }),
};
