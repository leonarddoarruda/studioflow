"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/logo";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        phone: form.get("phone"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao criar conta");
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <p className="mt-4 text-stone-500">Crie sua conta de cliente</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="name" name="name" label="Nome completo" required placeholder="Maria Silva" />
            <Input id="email" name="email" type="email" label="E-mail" required placeholder="seu@email.com" />
            <Input id="phone" name="phone" type="tel" label="WhatsApp" required placeholder="(11) 99999-9999" />
            <Input id="password" name="password" type="password" label="Senha" required minLength={6} placeholder="Mínimo 6 caracteres" />

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-violet-600 hover:text-violet-700">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
