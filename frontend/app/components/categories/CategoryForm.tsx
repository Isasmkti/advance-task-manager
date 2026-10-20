"use client";

import { useState, type FormEvent } from "react";
import { buttonClass, inputClass } from "@/lib/styles";

export function CategoryForm({ onSubmit }: { onSubmit: (name: string) => Promise<boolean> }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const ok = await onSubmit(name.trim());
    setSubmitting(false);
    if (ok) setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input className={inputClass} placeholder="Kategori baru (mis. Belajar)" value={name}
        onChange={(e) => setName(e.target.value)} maxLength={50} />
      <button className={buttonClass} disabled={submitting}>Tambah</button>
    </form>
  );
}
