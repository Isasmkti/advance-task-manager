import type { Difficulty } from "@/types";

export const DIFFICULTIES: { value: Difficulty; label: string; xp: number }[] = [
  { value: "easy", label: "Easy", xp: 10 },
  { value: "medium", label: "Medium", xp: 25 },
  { value: "hard", label: "Hard", xp: 50 },
  { value: "epic", label: "Epic", xp: 100 },
];
