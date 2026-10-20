"use client";

import { useState, type FormEvent } from "react";
import { DIFFICULTIES } from "@/lib/constants";
import { buttonClass, inputClass } from "@/lib/styles";
import type { Category, Difficulty, QuestInput } from "@/types";

interface Props {
  categories: Category[];
  onSubmit: (input: QuestInput) => Promise<boolean>;
}

export function QuestForm({ categories, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [categoryId, setCategoryId] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    const ok = await onSubmit({
      title: title.trim(),
      difficulty,
      category_id: categoryId ? Number(categoryId) : null,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
    });
    setSubmitting(false);
    if (ok) {
      setTitle("");
      setDueAt("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <input className={inputClass} placeholder="Quest baru..." value={title}
        onChange={(e) => setTitle(e.target.value)} maxLength={255} />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <select className={inputClass} value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>{d.label} ({d.xp} XP)</option>
          ))}
        </select>

        <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Tanpa kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input className={inputClass} type="datetime-local" value={dueAt}
          onChange={(e) => setDueAt(e.target.value)} aria-label="Deadline (opsional)" />
      </div>

      <button className={buttonClass} disabled={submitting}>Tambah quest</button>
    </form>
  );
}
