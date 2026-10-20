import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/types";

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan.";
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi
      .list()
      .then(setCategories)
      .catch((e) => setError(messageOf(e)));
  }, []);

  const addCategory = async (name: string): Promise<boolean> => {
    try {
      const category = await categoriesApi.create({ name });
      setCategories((prev) =>
        [...prev, category].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setError(null);
      return true;
    } catch (e) {
      setError(messageOf(e));
      return false;
    }
  };

  return { categories, error, addCategory };
}
