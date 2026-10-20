"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { buttonClass, inputClass } from "@/lib/styles";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const { user, loading, login, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Kalau sudah login, langsung ke dashboard.
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isRegister ? "Mulai petualanganmu" : "Selamat datang kembali"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegister && (
          <input className={inputClass} placeholder="Nama hero" value={name}
            onChange={(e) => setName(e.target.value)} required />
        )}
        <input className={inputClass} type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input className={inputClass} type="password" placeholder="Password (min. 8 karakter)" value={password}
          onChange={(e) => setPassword(e.target.value)} minLength={8} required />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className={`${buttonClass} w-full`} disabled={submitting}>
          {submitting ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-stone-500">
        {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
        <Link className="text-amber-700 underline" href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Masuk" : "Daftar"}
        </Link>
      </p>
    </main>
  );
}
