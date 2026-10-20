export type Difficulty = "easy" | "medium" | "hard" | "epic";

export interface HeroProgress {
  level: number;
  total_xp: number;
  level_start_xp: number;
  next_level_xp: number;
}

export interface User extends HeroProgress {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  color: string | null;
}

export interface Quest {
  id: number;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  category_id: number | null;
  due_at: string | null;
  completed_at: string | null;
  xp_awarded: number | null;
}

export interface QuestInput {
  title: string;
  description?: string | null;
  difficulty?: Difficulty;
  due_at?: string | null;
  category_id?: number | null;
}

export interface CompleteResult {
  quest: Quest;
  xp_awarded: number;
  leveled_up: boolean;
  progress: HeroProgress;
}

export interface AuthResponse {
  token: string;
  user: User;
}
